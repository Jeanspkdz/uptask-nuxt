import * as t from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { timestamps } from './_collums.helpers'
import { userTable } from './auth-schema'
import { projectTable } from './project'

export const collaboratorTable = pgTable('collaborators', {
  userId: t.text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }),
  projectId: t.text('project_id').notNull().references(() => projectTable.id, { onDelete: 'cascade' }),
  ...timestamps
}, (table) => [
  t.primaryKey({ columns: [table.projectId, table.userId] })
])
