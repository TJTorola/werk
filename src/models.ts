import DB from './db';
import { sets, plans, steps } from './db/schema';

type InsertOmit<T> = Omit<T, 'id' | 'createdAt' | 'deletedAt'>;

export const Set = {
  insert: (data: InsertOmit<typeof sets.$inferInsert>) =>
    DB.insert(sets).values({ ...data, createdAt: new Date() }),
  select: () => DB.select().from(sets),
};

export const Plan = {
  insert: (data: InsertOmit<typeof plans.$inferInsert>) =>
    getDb()
      .insert(plans)
      .values({ ...data, createdAt: new Date() }),
  select: () => getDb().select().from(plans),
};

export const PlanStep = {
  insert: (data: InsertOmit<typeof planSteps.$inferInsert>) =>
    getDb()
      .insert(planSteps)
      .values({ ...data, createdAt: new Date() }),
  select: () => getDb().select().from(planSteps),
};
