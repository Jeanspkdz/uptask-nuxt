import { relations } from '@@/server/db/schema/_relations'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.NUXT_DATABASE_URL || '', {
  prepare: false,
})
export const db = drizzle({
  client,
  relations,
})
