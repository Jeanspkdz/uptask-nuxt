import { user } from './auth-schema'
import { relations } from 'drizzle-orm'
import * as t from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { projectTask } from './project-task'
import { collaborator } from './collaborator'
import { timestamps } from './_collums.helpers'
import { createId } from '@paralleldrive/cuid2'

export const project = pgTable('projects', {
  id: t.text().primaryKey().$defaultFn(() => createId()),
  name: t.varchar({ length: 50 }).notNull(),
  clientName: t.varchar({ length: 50 }).notNull(),
  description: t.text().notNull(),
  userId: t.text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  ...timestamps
}, (table) => [
  t.unique().on(table.name, table.clientName, table.userId)
])

export const projectRelations = relations(project, ({ one, many }) => ({
  author: one(user, {
    fields: [project.userId],
    references: [user.id]
  }),
  projectTask: many(projectTask),
  collaborator: many(collaborator)
}))
