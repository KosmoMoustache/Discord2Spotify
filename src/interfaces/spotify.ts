export type IResponse<T> = GenericResponse<T> &
  (AuthenticationError | RegularError);
export type APIResponse<T> = T & AuthenticationError & RegularError;

export type GenericResponse<T> = {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: string;
  previous: string;
  total: number;
};

type HTTPCode =
  | 200
  | 201
  | 202
  | 204
  | 304
  | 400
  | 401
  | 403
  | 404
  | 429
  | 500
  | 502
  | 503;

type AuthenticationError = {
  error: string;
  error_description: string;
};
type RegularError = {
  error: {
    status: HTTPCode;
    message: string;
  };
};
export type ResponseCreated = {
  snapshot_id: string;
};

export interface SpotifyUser {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enable: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: SpotifyURI;
  };
  followers: {
    href: string;
    total: number;
  };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: SpotifyURI;
}

export interface Tokens {
  access_token: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

// Spotify URI example: "spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M"
export type SpotifyURI = `spotify:${string}:${string}`;

// Partial typing: https://developer.spotify.com/documentation/web-api/reference/#/operations/get-track
export type Track = {
  album: {
    [key: string]: unknown;
  };
  artists: {
    [key: string]: unknown;
  };
  href: string;
  id: string;
  name: string;
  track_number: number;
  external_urls: {
    spotify: string;
  } & Record<string, unknown>;
};

export type Image = {
  url: string;
  height: number;
  width: number;
};
export type Playlist = {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null | string;
    total: number;
  };
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: {
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string;
      total: 0;
    };
    href: string;
    id: string;
    type: 'user';
    uri: SpotifyURI;
    display_name: string;
  };
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    items: Track[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string;
    total: number;
  };
  type: string;
  uri: SpotifyURI;
};
