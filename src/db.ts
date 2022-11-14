import knex from 'knex';
import knexConfig from '../knexfile';

const environment = process.env.NODE_ENV || 'development';
const connectionConfig = knexConfig[environment];

/**
 * @type {import('knex').Knex} knex
 */
const connection = knex(connectionConfig);

export default connection;
