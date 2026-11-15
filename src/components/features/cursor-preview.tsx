"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties, ReactNode } from "react";

import { businesses } from "@/data/businesses";
import { projects } from "@/data/projects";
import { useMediaQuery } from "@/lib/use-media-query";
import { useRequiredContext } from "@/lib/use-required-context";
import { cn, densitySrcSet } from "@/lib/utils";

interface CursorPreviewState {
  height: number;
  image?: string;
  isVisible: boolean;
  width: number;
}

interface CursorPreviewContextValue {
  hidePreview: () => void;
  showPreview: (image?: string, width?: number, height?: number) => void;
}

const CursorPreviewContext = createContext<CursorPreviewContextValue | null>(
  null
);
CursorPreviewContext.displayName = "CursorPreviewProvider";

// Critically damped (damping = 2 * sqrt(stiffness)): follows the cursor
// tightly with no overshoot or wobble.
const STIFFNESS = 800;
const DAMPING = 2 * Math.sqrt(STIFFNESS);
// Gap between the cursor tip and the preview's top-left corner.
const CURSOR_OFFSET = 12;

// Previews without their own size in the data use these.
const DEFAULT_WIDTH = 248;
const DEFAULT_HEIGHT = 156;
const COARSE_POINTER_QUERY = "(pointer: coarse)";
const MEDIA_CLASSES = "size-full rounded-2xl object-cover";

const isVideoSrc = (src: string | undefined): src is string =>
  Boolean(src?.endsWith(".webm"));

const VIDEO_PREVIEWS = [
  ...projects.map((project) => project.preview),
  ...businesses.flatMap((business) =>
    business.buttons.map((button) => button.preview?.image)
  ),
].filter((src): src is string => isVideoSrc(src));

const isMediaReady = (el: HTMLImageElement | HTMLVideoElement): boolean =>
  el instanceof HTMLVideoElement
    ? el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
    : el.complete && el.naturalWidth > 0;

interface PreviewMediaProps {
  height: number;
  /** Called with `src` once the media has a frame to show (at once if cached). */
  onLoaded: (src: string) => void;
  src: string;
  width: number;
}

const PreviewMedia = ({ height, onLoaded, src, width }: PreviewMediaProps) => {
  const mediaRef = useCallback(
    (el: HTMLImageElement | HTMLVideoElement | null) => {
      if (!el) {
        return;
      }
      const markLoaded = () => onLoaded(src);
      if (isMediaReady(el)) {
        markLoaded();
        return;
      }
      const event = el instanceof HTMLVideoElement ? "loadeddata" : "load";
      el.addEventListener(event, markLoaded, { once: true });
      return () => el.removeEventListener(event, markLoaded);
    },
    [onLoaded, src]
  );

  return (
    // <picture>: the hand-made @2x/@3x files are the sources; no optimizer needed.
    <picture>
      <img
        alt=""
        className={MEDIA_CLASSES}
        height={height}
        ref={mediaRef}
        src={src}
        srcSet={densitySrcSet(src)}
        width={width}
      />
    </picture>
  );
};

export const CursorPreviewProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setState] = useState<CursorPreviewState>({
    height: DEFAULT_HEIGHT,
    isVisible: false,
    width: DEFAULT_WIDTH,
  });

  const isCoarsePointerRef = useRef(true);
  const isVisibleRef = useRef(false);
  const positionRef = useRef<HTMLDivElement>(null);
  // Set by the spring effect: jumps the preview to the cursor with no travel.
  const snapRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    isVisibleRef.current = state.isVisible;
  }, [state.isVisible]);

  const hidePreview = useCallback(() => {
    if (!isVisibleRef.current) {
      return;
    }
    isVisibleRef.current = false;
    setState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  // Touch devices never show previews: hide one that is up when the pointer
  // turns coarse, and never load the preview videos.
  const isCoarsePointer = useMediaQuery(COARSE_POINTER_QUERY);
  useEffect(() => {
    isCoarsePointerRef.current = isCoarsePointer !== false;
    if (isCoarsePointer) {
      hidePreview();
    }
  }, [hidePreview, isCoarsePointer]);

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

      render();
      raf = settled ? null : requestAnimationFrame(step);
    };

    const render = () => {
      // Whole pixels on a 3D layer: a fractional offset made Chrome composite
      // the video apart from its box, showing a band of the box colour.
      if (positionRef.current) {
        positionRef.current.style.transform = `translate3d(${Math.round(pos.x)}px, ${Math.round(pos.y)}px, 0)`;
      }
    };

    // A hidden preview must not fly in from wherever it was last shown.
    snapRef.current = () => {
      pos.x = target.x;
      pos.y = target.y;
      pos.vx = 0;
      pos.vy = 0;
      render();
    };

    const ensureLoop = () => {
      if (raf === null) {
        lastTime = performance.now();
        raf = requestAnimationFrame(step);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      target.x = e.clientX + CURSOR_OFFSET;
      target.y = e.clientY + CURSOR_OFFSET;
      ensureLoop();
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", hidePreview);
    window.addEventListener("scroll", hidePreview, true);
    return () => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", hidePreview);
      window.removeEventListener("scroll", hidePreview, true);
    };
  }, [hidePreview]);

  const showPreview = useCallback<CursorPreviewContextValue["showPreview"]>(
    (image, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) => {
      if (isCoarsePointerRef.current) {
        return;
      }
      if (!isVisibleRef.current) {
        snapRef.current?.();
      }
      isVisibleRef.current = true;
      setState((prev) => ({
        ...prev,
        height,
        image,
        isVisible: true,
        width,
      }));
    },
    []
  );

  const contextValue = useMemo(
    () => ({ hidePreview, showPreview }),
    [hidePreview, showPreview]
  );

  // Media that has a frame to show. The box stays hidden until its media is
  // ready, so a hover never flashes an empty box.
  const [readySrcs, setReadySrcs] = useState<ReadonlySet<string>>(new Set());
  const markReady = useCallback((src: string) => {
    setReadySrcs((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));
  }, []);
  const isReady = state.image !== undefined && readySrcs.has(state.image);
  const isShown = state.isVisible && isReady;

  // Every preview video stays mounted and buffered (fine pointers only), so a
  // hover only switches which one plays: no new player, no blank first frame.
  const videosRef = useRef(new Map<string, HTMLVideoElement>());
  useEffect(() => {
    for (const [src, video] of videosRef.current) {
      if (state.isVisible && src === state.image) {
        // play() rejects if the tab is hidden: stay paused; the next hover retries.
        video.play().catch(() => video.pause());
      } else {
        video.pause();
      }
    }
  }, [state.image, state.isVisible]);

  const videos =
    isCoarsePointer === false
      ? VIDEO_PREVIEWS.map((src) => (
          <video
            className={cn(
              MEDIA_CLASSES,
              "absolute inset-0",
              src !== state.image && "invisible"
            )}
            key={src}
            loop
            muted
            onLoadedData={() => markReady(src)}
            playsInline
            preload="auto"
            ref={(el) => {
              if (el) {
                videosRef.current.set(src, el);
                if (isMediaReady(el)) {
                  markReady(src);
                }
              } else {
                videosRef.current.delete(src);
              }
            }}
            src={src}
          />
        ))
      : null;

  // key={src}: a new image never shows the old one at the new size.
  const image =
    state.image && !isVideoSrc(state.image) ? (
      <PreviewMedia
        height={state.height}
        key={state.image}
        onLoaded={markReady}
        src={state.image}
        width={state.width}
      />
    ) : null;

  return (
    <CursorPreviewContext.Provider value={contextValue}>
      {children}
      {/* Outer div is positioned imperatively by the spring loop; React never touches its style. */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-50"
        ref={positionRef}
      >
        {/* No blur filter: filtering a playing <video> made Chrome draw it
            shifted inside its box during the transition. */}
        <div
          className={cn(
            "h-(--preview-height) w-(--preview-width) origin-top-left overflow-hidden rounded-2xl shadow-2xl transition-fade-scale duration-200 ease-out-quint",
            "relative",
            isShown ? "scale-100 opacity-100" : "scale-90 opacity-0"
          )}
          style={
            {
              "--preview-height": `${state.height}px`,
              "--preview-width": `${state.width}px`,
            } as CSSProperties
          }
        >
          {videos}
          {image}
        </div>
      </div>
    </CursorPreviewContext.Provider>
  );
};

export const useCursorPreview = () =>
  useRequiredContext(CursorPreviewContext, "useCursorPreview");
