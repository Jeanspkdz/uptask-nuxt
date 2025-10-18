import { pgTable } from 'drizzle-orm/pg-core'
import * as t from 'drizzle-orm/pg-core'

export const project = pgTable('projects', {
  id: t.serial().primaryKey(),
  name: t.varchar({ length: 256 })
  // home: t.integer().primaryKey().generatedAlwaysAsIdentity()
})
