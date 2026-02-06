import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { userTable } from '#server/db/schema/auth-schema'
import { projectTaskTable } from '#server/db/schema/project-task'
import z from 'zod'
import { projectTable } from '#server/db/schema/project'

export const projectSelectSchema = createSelectSchema(projectTable)
export const projectInsertchema = createInsertSchema(projectTable)
export const projectUpdateSchema = createUpdateSchema(projectTable)
// type A = z.infer<typeof projectUpdateSchema>
// type B = z.infer<typeof projectSelectSchema>
// type C = z.infer<typeof projectTaskInsertSchema>

export const projectTaskSelectSchema = createSelectSchema(projectTaskTable)
export const projectTaskInsertSchema = createInsertSchema(projectTaskTable)
export const projectTaskUpdateSchema = createUpdateSchema(projectTaskTable)
export const projectTaskReorderSchema = projectTaskSelectSchema.pick({
  id: true,
  state: true,
  description: true,
  order: true,
  name: true,
})

export const userSelectSchema = createSelectSchema(userTable)
export const userInsertSchema = createInsertSchema(userTable)

// ROUTE_PARAMS
export const routeParamsSchema = z.object({
  projectId: z.cuid2(),
  taskId: z.cuid2(),
})
