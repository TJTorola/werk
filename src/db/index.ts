import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate as drizzleMigrate } from 'drizzle-orm/bun-sqlite/migrator';
import * as schema from './schema';
import { getDataPath } from '../fs';

const DB = drizzle(
  new Database(`${getDataPath()}/database.sqlite`, { create: true }),
  {
    schema,
  },
);

export const migrate = () =>
  drizzleMigrate(DB, { migrationsFolder: './src/db/migrations' });

export default DB;
