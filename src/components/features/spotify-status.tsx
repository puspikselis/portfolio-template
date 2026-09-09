"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Note } from "@/components/icons/note";
import { RollingText } from "@/components/ui/rolling-text";
import type { SpotifyData } from "@/lib/spotify";

const NAME = "Kristaps Krūze";
const POLL_INTERVAL_MS = 30_000;

export function SpotifyStatus() {
  const [data, setData] = useState<SpotifyData | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    const fetchNowPlaying = async () => {
      try {
        const response = await fetch("/api/spotify");
        const spotifyData = await response.json();
        setData(spotifyData.isPlaying ? spotifyData : null);
      } catch {
        // network hiccup — keep showing the last known state
      }
    };

    const start = () => {
      if (interval !== undefined) {
        return;
      }
      fetchNowPlaying();
      interval = setInterval(fetchNowPlaying, POLL_INTERVAL_MS);
    };

    const stop = () => {
      if (interval === undefined) {
        return;
      }
      clearInterval(interval);
      interval = undefined;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    if (!document.hidden) {
      start();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <Link href="/">
        <RollingText className="font-semibold text-13/4 text-ink" text={NAME} />
      </Link>
      {data ? (
        <a
          aria-label={`Currently listening to ${data.title} by ${data.artist} on Spotify`}
          className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
          href={data.songUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="text-dim-gray-100">
            <Note />
          </div>
          <div className="relative max-w-20 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap font-medium text-12/4 -tracking-[0.03em]">
              {[0, 1].map((i) => (
                <span className="pr-6" key={i}>
                  <span className="text-nobel-100">Listening to </span>
                  <span className="text-dim-gray-100">
                    {data.title} - {data.artist}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </a>
      ) : (
        <div className="font-medium text-12/4 text-dim-gray-100 -tracking-[0.03em]">
          Designer
        </div>
      )}
    </>
  );
}
