import { eq } from 'drizzle-orm'
import z from 'zod'
import { projectTable } from '~~/server/db/schema/project'
import { createCustomError } from '~~/server/errors'

const routeParamValidator = routeParamsSchema.pick({ projectId: true })
const routeBodyValidator = z.object({ password: z.string().min(8) })

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createCustomError('GENERIC', 'UNAUTHORIZED')
  }

  const routeParamsValidationResult = await getValidatedRouterParams(
    event,
    routeParamValidator.safeParse
  )

  if (!routeParamsValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const routeBodyValidationResult = await readValidatedBody(
    event,
    routeBodyValidator.safeParse
  )

  if (!routeBodyValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { projectId } = routeParamsValidationResult.data
  const { password } = routeBodyValidationResult.data

  const verifyPasswordResult = await auth.api.verifyPassword({
    body: {
      password,
    },
    headers: getRequestHeaders(event) as HeadersInit,
    asResponse: true,
  })

  if (!verifyPasswordResult.ok) {
    throw createCustomError('AUTH', 'INVALID_PASSWORD')
  }
  const deletedProject = await db.delete(projectTable).where(eq(projectTable.id, projectId)).returning()

  return {
    deletedProject
  }
})
