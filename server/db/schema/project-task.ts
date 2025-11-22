import { relations } from 'drizzle-orm'
import * as t from 'drizzle-orm/pg-core'
import { pgEnum, pgTable } from 'drizzle-orm/pg-core'
import { projectTable } from './project'
import { timestamps } from './_collums.helpers'
import { createId } from '@paralleldrive/cuid2'

export const taskState = pgEnum('task_states', [
  'pending',
  'waiting',
  'in_progress',
  'in_review',
  'completed'
])

export const projectTaskTable = pgTable('project_tasks', {
  id: t.text().primaryKey().$defaultFn(() => createId()),
  name: t.varchar({ length: 100 }).notNull(),
  description: t.text().notNull(),
  state: taskState().default('pending').notNull(),
  order: t.integer().notNull(),
  projectId: t.text('project_id').references(() => projectTable.id, { onDelete: 'cascade' }),
  ...timestamps
}, (table) => [
  t.unique().on(table.projectId, table.order)
])

export const projectTaskRelations = relations(projectTaskTable, ({ one }) => ({
  project: one(projectTable, {
    fields: [projectTaskTable.projectId],
    references: [projectTable.id]
  }),
}))
