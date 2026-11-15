import { describe, expect, test } from "bun:test";

import { toSpotifyData } from "@/lib/spotify";

describe("toSpotifyData", () => {
  test("track: joins artist names", () => {
    expect(
      toSpotifyData({
        is_playing: true,
        item: {
          artists: [{ name: "A" }, { name: "B" }],
          external_urls: { spotify: "https://open.spotify.com/track/1" },
          name: "Song",
        },
      })
    ).toEqual({
      artist: "A, B",
      isPlaying: true,
      songUrl: "https://open.spotify.com/track/1",
      title: "Song",
    });
  });

  test("episode: no artists, uses the show name instead of throwing", () => {
    expect(
      toSpotifyData({
        is_playing: true,
        item: {
          external_urls: { spotify: "https://open.spotify.com/episode/1" },
          name: "Episode 12",
          show: { name: "The Show" },
        },
      })
    ).toMatchObject({ artist: "The Show", title: "Episode 12" });
  });

  test("nothing playing", () => {
    expect(toSpotifyData({ is_playing: false, item: null })).toBeNull();
  });
});
