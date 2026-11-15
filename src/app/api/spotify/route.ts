import { NextResponse } from "next/server";

import { getNowPlaying, toSpotifyData } from "@/lib/spotify";

export const revalidate = 0;

const NOT_PLAYING = { isPlaying: false } as const;

export const GET = async () => {
  try {
    const response = await getNowPlaying();

    if (response.status === 204 || response.status > 400) {
      return NextResponse.json(NOT_PLAYING);
    }

    const data = toSpotifyData(await response.json());

    return NextResponse.json(data ?? NOT_PLAYING);
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return NextResponse.json(NOT_PLAYING);
  }
};
