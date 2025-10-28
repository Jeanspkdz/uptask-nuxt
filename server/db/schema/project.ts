import { user } from './auth-schema'
import { relations } from 'drizzle-orm'
import * as t from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { projectTask } from './project-task'
import { collaborator } from './collaborator'
import { timestamps } from './_collums.helpers'

export const project = pgTable('projects', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar({ length: 256 }).notNull(),
  clientName: t.varchar({ length: 50 }).notNull(),
  description: t.text().notNull(),
  userId: t.text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  ...timestamps
})

export const projectRelations = relations(project, ({ one, many }) => ({
  author: one(user, {
    fields: [project.userId],
    references: [user.id]
  }),
  projectTask: many(projectTask),
  collaborator: many(collaborator)
}))
