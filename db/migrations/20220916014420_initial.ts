import { Knex } from 'knex';
import { references } from '../../src/utils/tableUtils';
import tn from '../../src/constants';

export async function up(knex: Knex): Promise<void> {
  await Promise.all([
    await knex.schema.createTable(tn.user, (table) => {
      table.increments().notNullable();
      table.string('spotify_id').notNullable().unique().index();
      table.string('discord_id').unique();
      table.string('spotify_name').notNullable();
      table.string('discord_name');
      table.timestamps(false, true);
    }),
    knex.schema.createTable(tn.user_tokens, (table) => {
      table.increments().notNullable();
      references(table, tn.user);
      table.string('access_token').notNullable();
      table.string('scope').notNullable();
      table.string('expires_in').notNullable();
      table.string('refresh_token').notNullable();
      table.timestamps(false, true);
    }),
    knex.schema.createTable(tn.user_channel, (table) => {
      table.increments().notNullable();
      references(table, tn.user);
      table.string('discord_id').notNullable();
      table.string('channel_id').notNullable();
      table.timestamps(false, true);
    }),
    knex.schema.createTable(tn.user_playlist, (table) => {
      table.increments().notNullable();
      references(table, tn.user);
      table.string('playlist_id').notNullable();
      table.string('playlist_name');
      table.datetime('last_updated');
      table.timestamps(false, true);
    }),
    knex.schema.createTable(tn.register_link, (table) => {
      table.increments().notNullable();
      table.string('uuid').notNullable().unique();
      table.string('discord_id').notNullable();
      table.string('discord_name').notNullable();
      table.boolean('is_expired').defaultTo(false);
      table.datetime('expiration_date').notNullable();
    }),
    knex.schema.createTable(tn.lookup_channel, (table) => {
      table.increments().notNullable();
      table.string('guild_id').notNullable();
      table.string('channel_id').notNullable().unique().index();
      table.string('discord_id');
      table.timestamps(false, true);
    }),
    knex.schema.createTable(tn.action_history, (table) => {
      table.increments().notNullable();
      references(table, tn.user);
      table.string('action_type').notNullable();
      table.json('metadata');
      table.string('url');
      table.timestamps(false, true);
    }),
  ]);
}


export async function down(knex: Knex): Promise<void> {
  await Promise.all([
    [
      tn.user_channel,
      tn.user_tokens,
      tn.user_playlist,
      tn.action_history,
      tn.register_link,
      tn.lookup_channel,
      tn.user,
    ].forEach(async (table: string): Promise<void> => {
      await knex.schema.dropTable(table);
    })
  ]);
}

