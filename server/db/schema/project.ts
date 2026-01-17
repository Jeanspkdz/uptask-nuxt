import { createId } from '@paralleldrive/cuid2'
import * as t from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { timestamps } from './_collums.helpers'
import { userTable } from './auth-schema'

export const projectTable = pgTable('projects', {
  id: t.text().primaryKey().$defaultFn(() => createId()),
  name: t.varchar({ length: 50 }).notNull(),
  clientName: t.varchar({ length: 50 }).notNull(),
  description: t.text().notNull(),
  userId: t.text('user_id').references(() => userTable.id, { onDelete: 'cascade' }).notNull(),
  ...timestamps
}, (table) => [
  t.unique().on(table.name, table.clientName, table.userId)
])
