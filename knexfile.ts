import type { Knex } from 'knex';
import knex from 'knex';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const config: { [key: string]: Knex.Config } = {
  development: {
    debug: true,
    client: 'mysql2',
    connection: {
      database: process.env.MARIADB_DATABASE,
      user: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
  production: {
    debug: false,
    client: 'mysql2',
    connection: {
      database: process.env.MARIADB_DATABASE,
      user: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
};

export default config;

export const conn = knex(config[process.env.NODE_ENV || 'development']);
