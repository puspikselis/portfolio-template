"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { AnimatedText } from "@/components/ui/animated-text";
import { cn } from "@/lib/utils";

interface Config {
  color: string;
  description: string;
  title: string;
}

const DEFAULT_STICKY_TOP_FALLBACK = 160;
const DEFAULT_DASH = "var(--color-dim-gray-100)";
const HYSTERESIS = 4;
const BOTTOM_THRESHOLD_PX = 100; // Fixed pixel threshold instead of percentage

// Walking from the last section up, pick the first one visible in the
// viewport and compute how far the floating label must shift down to align
// with it (or its explicit [data-align-target]).
function nearBottomTarget(
  elements: HTMLElement[],
  viewportH: number,
  stickyTop: number
): { activeEl: HTMLElement | null; offset: number } {
  for (let i = elements.length - 1; i >= 0; i -= 1) {
    const rect = elements[i].getBoundingClientRect();
    if (rect.top < viewportH && rect.bottom > 0) {
      const activeEl = elements[i];
      const alignTarget = activeEl.querySelector<HTMLElement>(
        "[data-align-target]"
      );
      const topRect = alignTarget ? alignTarget.getBoundingClientRect() : rect;
      const offset = topRect.top > stickyTop ? topRect.top - stickyTop : 0;
      return { activeEl, offset };
    }
  }
  return { activeEl: null, offset: 0 };
}

// Normal scrolling: the section whose band straddles the floating label wins;
// otherwise the last section that has scrolled past it.
function scrolledTarget(
  elements: HTMLElement[],
  floatingTop: number
): HTMLElement | null {
  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    if (
      rect.top <= floatingTop - HYSTERESIS &&
      rect.bottom > floatingTop + HYSTERESIS
    ) {
      return el;
    }
  }
  let lastPassed: HTMLElement | null = null;
  for (const el of elements) {
    if (el.getBoundingClientRect().top <= floatingTop) {
      lastPassed = el;
    } else {
      break;
    }
  }
  return lastPassed;
}

export function FloatingThingy() {
  const [config, setConfig] = useState<Config>({
    color: "",
    description: "",
    title: "",
  });

  const floatingRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const lastSigRef = useRef("");
  const stickyTopRef = useRef<number>(DEFAULT_STICKY_TOP_FALLBACK);
  const elementsRef = useRef<HTMLElement[]>([]);
  const updateActiveElementRef = useRef<() => void>(() => {
    // replaced with the real handler once the effect below runs
  });

  const offsetRef = useRef(0);

  const readStickyTop = useCallback(() => {
    const el = floatingRef.current;
    if (!el) {
      return;
    }
    const topPx = Number.parseFloat(
      getComputedStyle(el).top || `${DEFAULT_STICKY_TOP_FALLBACK}`
    );
    if (!Number.isNaN(topPx)) {
      stickyTopRef.current = topPx;
    }
  }, []);

  const collectElements = useCallback(() => {
    elementsRef.current = Array.from(
      document.querySelectorAll<HTMLElement>("[data-title]")
    );
  }, []);

  // Write the CSS var directly to avoid a React re-render per update;
  // the transition on `translate` does the smoothing.
  const setOffset = useCallback((px: number) => {
    const next = Math.max(0, Math.trunc(px));
    if (next === offsetRef.current) {
      return;
    }
    offsetRef.current = next;
    floatingRef.current?.style.setProperty("--offset", `${next}px`);
  }, []);

  useLayoutEffect(() => {
    floatingRef.current?.style.setProperty("--offset", "0px");
    collectElements();
    readStickyTop();
  }, [collectElements, readStickyTop]);

  useEffect(() => {
    collectElements();

    const mo = new MutationObserver(() => {
      collectElements();
      requestAnimationFrame(() => updateActiveElementRef.current?.());
    });

    mo.observe(document.body, {
      attributeFilter: ["data-title", "data-description", "data-color"],
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => mo.disconnect();
  }, [collectElements]);

  useEffect(() => {
    const el = floatingRef.current;
    if (!el || typeof ResizeObserver === "undefined") {
      return;
    }
    const ro = new ResizeObserver(() => readStickyTop());
    ro.observe(el);
    return () => ro.disconnect();
  }, [readStickyTop]);

  useEffect(() => {
    const readAttrs = (el: HTMLElement) => {
      const ds = el.dataset as Record<string, string | undefined>;
      return {
        color: ds.color || "",
        description: ds.description || "",
        title: ds.title || "",
      };
    };

    const updateConfig = (el: HTMLElement) => {
      const { title, description, color } = readAttrs(el);
      const sig = `${title}|${description}|${color}`;
      if (lastSigRef.current === sig) {
        return;
      }
      setConfig({ color, description, title });
      lastSigRef.current = sig;
    };

    const updateActiveElement = () => {
      const host = floatingRef.current;
      const elements = elementsRef.current;
      if (!host) {
        return;
      }

      if (elements.length === 0) {
        if (lastSigRef.current !== "") {
          setConfig({ color: "", description: "", title: "" });
          lastSigRef.current = "";
        }
        return;
      }

      const stickyTop = stickyTopRef.current;
      const viewportH = window.innerHeight;
      const scrollBottom = window.scrollY + viewportH;
      const docH = document.documentElement.scrollHeight;
      // Use fixed pixel threshold instead of percentage - more reliable across different page heights
      const nearBottom = docH - scrollBottom <= BOTTOM_THRESHOLD_PX;

      let activeEl: HTMLElement | null;
      let offset = 0;

      if (nearBottom) {
        ({ activeEl, offset } = nearBottomTarget(
          elements,
          viewportH,
          stickyTop
        ));
      } else {
        activeEl = scrolledTarget(elements, host.getBoundingClientRect().top);
      }

      activeEl = activeEl || elements[0];

      setOffset(offset);
      if (activeEl) {
        updateConfig(activeEl);
      }
    };

    updateActiveElementRef.current = updateActiveElement;

    const onResize = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        readStickyTop();
        updateActiveElement();
      });
    };

    const onScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() =>
        updateActiveElementRef.current?.()
      );
    };

    updateActiveElement();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [readStickyTop, setOffset]);

  const style = {
    "--dash-color": config.color || DEFAULT_DASH,
  } as React.CSSProperties;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-40 z-10 hidden md:block">
      <div className="mx-auto max-w-404">
        <div
          aria-atomic="true"
          aria-live="polite"
          className={cn(
            "translate-y-[var(--offset)] space-y-2 pl-24 transition-[translate] duration-200 ease-out",
            config.title &&
              'before:absolute before:top-2 before:left-0 before:block before:h-px before:w-8 before:bg-nero-500 before:content-[""]',
            config.title &&
              'after:absolute after:top-2 after:left-12 after:block after:h-px after:w-8 after:bg-[var(--dash-color)] after:transition-colors after:content-[""]'
          )}
          ref={floatingRef}
          style={style}
        >
          {config.title ? (
            <div className="font-medium text-13/4 text-ink">
              <AnimatedText text={config.title} />
            </div>
          ) : null}
          {config.description ? (
            <p className="max-w-45 font-medium text-12/5 text-dim-gray-100 -tracking-[0.03em]">
              <AnimatedText text={config.description} />
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
