import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const sets = sqliteTable('sets', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  workout: text('workout').notNull(),
  weight: integer('weight').notNull(),
  reps: integer('reps').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const plans = sqliteTable('plans', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const plansRelations = relations(plans, ({ many }) => ({
  steps: many(steps),
}));

export const steps = sqliteTable('steps', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  planId: integer('plan_id')
    .references(() => plans.id)
    .notNull(),
  workout: text('workout').notNull(),
  order: integer('order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const stepsRelations = relations(steps, ({ one }) => ({
  plan: one(plans),
}));
