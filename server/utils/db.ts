import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@@/server/db/schema/schema'
import * as authSchema from '@@/server/db/schema/auth-schema'

const client = postgres(process.env.NUXT_DATABASE_URL || '', {
  prepare: false,
})
export const db = drizzle(client, {
  schema: {
    ...schema,
    ...authSchema
  }
})
