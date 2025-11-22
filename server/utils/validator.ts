import { z } from 'zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { projectTaskTable } from '../db/schema/project-task'

export const projectTaskSelectSchema = createSelectSchema(projectTaskTable)
export const projectTaskInsertSchema = createInsertSchema(projectTaskTable)
export const projectTaskInsertSchemaArray = z.array(projectTaskInsertSchema)
export const projectTaskUpdateSchema = createUpdateSchema(projectTaskTable)
export const projectTaskUpdateSchemaArray = z.array(projectTaskInsertSchema)
