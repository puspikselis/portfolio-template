const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic =
  client_id && client_secret
    ? Buffer.from(`${client_id}:${client_secret}`).toString("base64")
    : "";
// additional_types=episode: without it Spotify reports podcasts as item: null.
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing?additional_types=track,episode";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const getAccessToken = async () => {
  if (!refresh_token) {
    throw new Error("Spotify refresh token is not configured");
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  return response.json();
};

export const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export interface SpotifyData {
  artist: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
}

/** The parts of Spotify's currently-playing payload we read (tracks and podcast episodes). */
interface NowPlayingPayload {
  is_playing?: boolean;
  item?: {
    artists?: { name: string }[];
    external_urls?: { spotify?: string };
    name: string;
    show?: { name: string };
  } | null;
}

/** Maps the payload to what the header shows; a track's artists, or an episode's show. */
export const toSpotifyData = (
  payload: NowPlayingPayload
): SpotifyData | null => {
  const { item } = payload;
  if (!item) {
    return null;
  }
  // Episodes have no artists; their show stands in for the artist.
  const { artists = [], show = { name: "" } } = item;
  const artist =
    artists.length > 0 ? artists.map(({ name }) => name).join(", ") : show.name;

  return {
    artist,
    isPlaying: Boolean(payload.is_playing),
    songUrl: item.external_urls?.spotify ?? "",
    title: item.name,
  };
};
