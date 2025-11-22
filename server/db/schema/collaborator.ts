import { pgTable } from 'drizzle-orm/pg-core'
import * as t from 'drizzle-orm/pg-core'
import { user } from './auth-schema'
import { projectTable } from './project'
import { relations } from 'drizzle-orm'
import { timestamps } from './_collums.helpers'

export const collaborator = pgTable('collaborators', {
  userId: t.text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  projectId: t.text('project_id').notNull().references(() => projectTable.id, { onDelete: 'cascade' }),
  ...timestamps
}, (table) => [
  t.primaryKey({ columns: [table.projectId, table.userId] })
])

export const collaboratorRelations = relations(collaborator, ({ one }) => ({
  user: one(user, {
    fields: [collaborator.userId],
    references: [user.id]
  }),
  project: one(projectTable, {
    fields: [collaborator.projectId],
    references: [projectTable.id]
  })
}))
