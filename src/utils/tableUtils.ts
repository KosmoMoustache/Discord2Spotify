import type { Knex } from 'knex';

export function url(table: Knex.TableBuilder, columnName: string) {
  table.string(columnName, 2000);
}

export function email(table: Knex.TableBuilder, columnName: string) {
  return table.string(columnName, 254);
}

export function references(
  table: Knex.TableBuilder,
  tableName: string,
  notNullable = true,
  columnName = '',
  cascade = true
) {
  const definition = table
    .integer(`${columnName || tableName}_id`)
    .unsigned()
    .references('id')
    .inTable(tableName);

  if (cascade) {
    definition.onDelete('cascade');
  }
  if (notNullable) {
    definition.notNullable();
  }
  return definition;
}
