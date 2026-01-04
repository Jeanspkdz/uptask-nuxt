import * as t from 'drizzle-orm/pg-core'

export const timestamps = {
  createdAt: t.timestamp({ mode: 'date', withTimezone: true, precision: 4 }).defaultNow().notNull(),
  updatedAt: t.timestamp({ withTimezone: true, precision: 4 }).defaultNow().notNull().$onUpdate(() => new Date())
}
