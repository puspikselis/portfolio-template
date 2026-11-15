"use client";

import { useEffect, useState } from "react";

export const GridOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+G (Mac) or Ctrl+G (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === "g") {
        event.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-50 min-h-full">
      {/* Rows grid - 4px height, 4px gap - red 10% */}
      <div className="absolute inset-0 min-h-full bg-grid-rows" />

      {/* 12 columns (64px width, 32px gutter) - red 10% centered */}
      <div className="absolute inset-0 flex min-h-full justify-center">
        <div className="h-full w-grid bg-grid-columns" />
      </div>
    </div>
  );
};
