"use client";

import Image from "next/image";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { DEFAULT_PREVIEW_COLOR } from "@/lib/constants";

interface CursorPreviewState {
  color: string;
  height: number;
  image?: string;
  isVisible: boolean;
  width: number;
}

interface CursorPreviewContextValue {
  hidePreview: () => void;
  showPreview: (
    color: string,
    image?: string,
    width?: number,
    height?: number
  ) => void;
}

const CursorPreviewContext = createContext<CursorPreviewContextValue | null>(
  null
);

// Spring constants matching the previous motion/react config ({ stiffness: 800, damping: 25 }).
const STIFFNESS = 800;
const DAMPING = 25;

const DEFAULT_WIDTH = 248;
const DEFAULT_HEIGHT = 156;
const COARSE_POINTER_QUERY = "(pointer: coarse)";
const FILE_EXT_RE = /(\.[a-z0-9]+)$/i;

export function CursorPreviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CursorPreviewState>({
    color: DEFAULT_PREVIEW_COLOR,
    height: DEFAULT_HEIGHT,
    isVisible: false,
    width: DEFAULT_WIDTH,
  });

  const isCoarsePointerRef = useRef(false);
  const isVisibleRef = useRef(false);
  const positionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isVisibleRef.current = state.isVisible;
  }, [state.isVisible]);

  useEffect(() => {
    const mql = window.matchMedia(COARSE_POINTER_QUERY);
    isCoarsePointerRef.current = mql.matches;
    const onChange = (e: MediaQueryListEvent) => {
      isCoarsePointerRef.current = e.matches;
      if (e.matches) {
        setState((prev) => ({ ...prev, isVisible: false }));
      }
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const target = { x: 0, y: 0 };
    const pos = { vx: 0, vy: 0, x: 0, y: 0 };
    let raf: number | null = null;
    let lastTime = 0;

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.032);
      lastTime = now;
      pos.vx += (-STIFFNESS * (pos.x - target.x) - DAMPING * pos.vx) * dt;
      pos.vy += (-STIFFNESS * (pos.y - target.y) - DAMPING * pos.vy) * dt;
      pos.x += pos.vx * dt;
      pos.y += pos.vy * dt;

      const settled =
        Math.abs(pos.x - target.x) < 0.1 &&
        Math.abs(pos.y - target.y) < 0.1 &&
        Math.abs(pos.vx) < 0.1 &&
        Math.abs(pos.vy) < 0.1;
      if (settled) {
        pos.x = target.x;
        pos.y = target.y;
        pos.vx = 0;
        pos.vy = 0;
      }

      if (positionRef.current) {
        positionRef.current.style.translate = `${pos.x}px ${pos.y}px`;
      }
      raf = settled ? null : requestAnimationFrame(step);
    };

    const ensureLoop = () => {
      if (raf === null) {
        lastTime = performance.now();
        raf = requestAnimationFrame(step);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      target.x = e.clientX + 12;
      target.y = e.clientY + 12;
      ensureLoop();
    };
    const dismiss = () => {
      if (!isVisibleRef.current) {
        return;
      }
      setState((prev) => ({ ...prev, isVisible: false }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", dismiss);
    window.addEventListener("scroll", dismiss, true);
    return () => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", dismiss);
      window.removeEventListener("scroll", dismiss, true);
    };
  }, []);

  const showPreview = useCallback<CursorPreviewContextValue["showPreview"]>(
    (color, image, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) => {
      if (isCoarsePointerRef.current) {
        return;
      }
      setState((prev) => ({
        ...prev,
        color,
        height,
        image,
        isVisible: true,
        width,
      }));
    },
    []
  );

  const hidePreview = useCallback(() => {
    if (!isVisibleRef.current) {
      return;
    }
    setState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const contextValue = useMemo(
    () => ({ hidePreview, showPreview }),
    [hidePreview, showPreview]
  );

  const isVideo = state.image?.endsWith(".webm");

  // Serves the hand-generated @2x/@3x density variants that live next to
  // every 1x preview asset, bypassing the Next optimizer.
  const previewLoader = useCallback(
    ({ src, width }: { src: string; width: number }) => {
      if (width <= state.width) {
        return src;
      }
      const scale = width <= state.width * 2 ? "@2x" : "@3x";
      return src.replace(FILE_EXT_RE, `${scale}$1`);
    },
    [state.width]
  );

  let media: ReactNode = null;
  if (state.image) {
    media = isVideo ? (
      <video
        autoPlay
        className="size-full object-cover"
        loop
        muted
        playsInline
        src={state.image}
      />
    ) : (
      <Image
        alt=""
        className="size-full object-cover"
        height={state.height}
        loader={previewLoader}
        src={state.image}
        width={state.width}
      />
    );
  }

  return (
    <CursorPreviewContext.Provider value={contextValue}>
      {children}
      {/* Outer div is positioned imperatively by the spring loop; React never touches its style. */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-50"
        ref={positionRef}
      >
        <div
          className="overflow-hidden rounded-2xl shadow-2xl"
          style={{
            backgroundColor: state.color,
            filter: state.isVisible ? "blur(0px)" : "blur(8px)",
            height: state.height,
            opacity: state.isVisible ? 1 : 0,
            scale: state.isVisible ? "1" : "0.85",
            transition: `opacity 250ms cubic-bezier(0.22,1,0.36,1), scale 250ms cubic-bezier(0.22,1,0.36,1), filter 250ms cubic-bezier(0.22,1,0.36,1) ${state.isVisible ? 30 : 0}ms`,
            width: state.width,
          }}
        >
          {media}
        </div>
      </div>
    </CursorPreviewContext.Provider>
  );
}

export function useCursorPreview() {
  const context = useContext(CursorPreviewContext);
  if (!context) {
    throw new Error(
      "useCursorPreview must be used within CursorPreviewProvider"
    );
  }
  return context;
}
