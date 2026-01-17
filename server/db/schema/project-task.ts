import { createId } from '@paralleldrive/cuid2'
import * as t from 'drizzle-orm/pg-core'
import { pgEnum, pgTable } from 'drizzle-orm/pg-core'
import { timestamps } from './_collums.helpers'
import { projectTable } from './project'
import { userTable } from './auth-schema'

export const taskState = pgEnum('task_states', [
  'pending',
  'waiting',
  'in_progress',
  'in_review',
  'completed',
])

export const projectTaskTable = pgTable(
  'project_tasks',
  {
    id: t
      .text()
      .primaryKey()
      .$defaultFn(() => createId()),
    name: t.varchar({ length: 100 }).notNull(),
    description: t.text().notNull(),
    state: taskState().default('pending').notNull(),
    order: t.integer().notNull(),
    projectId: t
      .text('project_id')
      .references(() => projectTable.id, { onDelete: 'cascade' }),
    userId: t
      .text('user_id')
      .references(() => userTable.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => [t.unique().on(table.projectId, table.order, table.state)]
)
