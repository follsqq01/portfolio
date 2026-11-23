import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const archiveState = sqliteTable('archive_state', {
  id: integer('id').primaryKey(),
  payload: text('payload').notNull(),
  revision: integer('revision').notNull().default(0),
});

export const archiveLoginAttempts = sqliteTable('archive_login_attempts', {
  key: text('key').primaryKey(),
  attempts: integer('attempts').notNull().default(0),
  expires: integer('expires').notNull(),
});

export const projectGalleries = sqliteTable('project_galleries', {
  slug: text('slug').primaryKey(),
  payload: text('payload').notNull(),
  revision: integer('revision').notNull().default(0),
});
