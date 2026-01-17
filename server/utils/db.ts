import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { relations } from '@@/server/db/schema/_relations'

const client = postgres(process.env.NUXT_DATABASE_URL || '', {
  prepare: false,
})
export const db = drizzle({ client, relations })
