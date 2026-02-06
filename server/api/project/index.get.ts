import { GENERIC_ERRORS } from '~~/server/errors'

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    return createError({
      statusCode: 401,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code']
    })
  }

  const userRelatedProjects = await db.query.user.findFirst({
    columns: {},
    where: {
      id: userAuthenticated.id
    },
    with: {
      ownedProjects: true,
      collaboratorProjects: true
    }
  })

  return userRelatedProjects
})
