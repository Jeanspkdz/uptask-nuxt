import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as projectTaskSchema from '~~/server/db/schema/project-task'
import * as projectSchema from '~~/server/db/schema/project'
import * as collaboratorSchema from '~~/server/db/schema/collaborator'
import * as authSchema from '@@/server/db/schema/auth-schema'

const client = postgres(process.env.NUXT_DATABASE_URL || '', {
  prepare: false,
})
export const db = drizzle(client, {
  schema: {
    ...projectSchema,
    ...projectTaskSchema,
    ...collaboratorSchema,
    ...authSchema
  },
  // casing: 'snake_case'
})
