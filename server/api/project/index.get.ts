import { eq } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
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

  const projectsByUser = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.userId, userAuthenticated.id))

  // const projectsByUser = await db.query.project.findMany({
  //   with: {
  //     tasks: true
  //   }
  // })

  return projectsByUser
})
