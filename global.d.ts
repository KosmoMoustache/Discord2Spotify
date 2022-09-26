import type { IClassUser } from './src/interfaces';

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      MARIADB_USER: string
      MARIADB_PASSWORD: string
      MARIADB_ROOT_PASSWORD: string
      MARIADB_DATABASE: string
      MARIADB_HOST: string
      DISCORD_ID: string
      DISCORD_KEY: string
      DISCORD_TOKEN: string
      SPOTIFY_ID: string
      SPOTIFY_SECRET: string
      EXPRESS_PORT?: string
      EXPRESS_SESSION_SECRET: string
      APP_URI: string
    }
  }
}

declare module 'express-session' {
  interface Session {
    user: IClassUser;
  }
}

export { };