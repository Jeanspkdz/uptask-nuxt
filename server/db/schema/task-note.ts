import { createId } from '@paralleldrive/cuid2'
import { pgTable } from 'drizzle-orm/pg-core'
import * as t from 'drizzle-orm/pg-core'
import { timestamps } from './_collums.helpers'
import { projectTaskTable } from './project-task'
import { userTable } from './auth-schema'

export const taskNoteTable = pgTable('task-note', {
  id: t.text().primaryKey().$defaultFn(() => createId()),
  description: t.text().notNull(),
  taskId: t
    .text('task_id')
    .notNull()
    .references(() => projectTaskTable.id, { onDelete: 'cascade' }),
  userId: t
    .text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  ...timestamps,
})
