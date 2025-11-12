import { eq } from 'drizzle-orm'
import { user } from '~~/server/db/schema/auth-schema'
import { project } from '~~/server/db/schema/project'
import { GENERIC_ERRORS } from '~~/server/errors'
import type { User } from '~~/server/types'

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    return createError({
      statusCode: 401,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code']
    })
  }

  const proyectsByUser = await db.select().from(project).innerJoin(user, eq(project.userId, user.id))
  // db.select().from(project).where(eq(project.userId, userAuthenticated.id))

  return proyectsByUser
})
