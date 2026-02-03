import { z } from 'zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { projectTaskTable } from '../db/schema/project-task'
import { userTable } from '../db/schema/auth-schema'

export const projectTaskSelectSchema = createSelectSchema(projectTaskTable)
export const projectTaskInsertSchema = createInsertSchema(projectTaskTable)
export const projectTaskInsertSchemaArray = z.array(projectTaskInsertSchema)
export const projectTaskUpdateSchema = createUpdateSchema(projectTaskTable)
export const projectTaskUpdateSchemaArray = z.array(projectTaskInsertSchema)

export const userSelectSchema = createSelectSchema(userTable)

export const projectTaskReorderShape = projectTaskSelectSchema.pick({
  id: true,
  state: true,
  description: true,
  order: true,
  name: true
})
