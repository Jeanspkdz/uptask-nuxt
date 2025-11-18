import { pgTable } from 'drizzle-orm/pg-core'
import * as t from 'drizzle-orm/pg-core'
import { user } from './auth-schema'
import { project } from './project'
import { relations } from 'drizzle-orm'
import { timestamps } from './_collums.helpers'

export const collaborator = pgTable('collaborators', {
  userId: t.text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  projectId: t.text('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  ...timestamps
}, (table) => [
  t.primaryKey({ columns: [table.projectId, table.userId] })
])

export const collaboratorRelations = relations(collaborator, ({ one }) => ({
  user: one(user, {
    fields: [collaborator.userId],
    references: [user.id]
  }),
  project: one(project, {
    fields: [collaborator.projectId],
    references: [project.id]
  })
}))
