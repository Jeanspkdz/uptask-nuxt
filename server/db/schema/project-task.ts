import { relations } from 'drizzle-orm'
import * as t from 'drizzle-orm/pg-core'
import { pgEnum, pgTable } from 'drizzle-orm/pg-core'
import { project } from './project'
import { timestamps } from './_collums.helpers'
import { createId } from '@paralleldrive/cuid2'

export const taskState = pgEnum('task_states', [
  'pending',
  'waiting',
  'in_progress',
  'in_review',
  'completed'
])

export const projectTask = pgTable('project_tasks', {
  id: t.text().primaryKey().$defaultFn(() => createId()),
  name: t.varchar({ length: 50 }).notNull(),
  description: t.text().notNull(),
  state: taskState().default('pending'),
  projectId: t.text('project_id').references(() => project.id, { onDelete: 'cascade' }),
  ...timestamps
})

export const projectTaskRelations = relations(projectTask, ({ one }) => ({
  project: one(project, {
    fields: [projectTask.projectId],
    references: [project.id]
  }),
}))
