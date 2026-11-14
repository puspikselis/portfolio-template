import { NextResponse } from "next/server";

import { getNowPlaying, toSpotifyData } from "@/lib/spotify";

export const revalidate = 0;

export async function GET() {
  try {
    const response = await getNowPlaying();

    if (response.status === 204 || response.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    const data = toSpotifyData(await response.json());

    return NextResponse.json(data ?? { isPlaying: false });
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return NextResponse.json({ isPlaying: false });
  }
}
