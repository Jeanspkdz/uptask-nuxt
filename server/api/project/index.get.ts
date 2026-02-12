import { createCustomError } from '~~/server/errors'

export default defineEventHandler(async (event) => {
  // await new Promise((resolve) => {
  //   setTimeout(resolve, 5000)
  // })

  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createCustomError('GENERIC', 'UNAUTHORIZED')
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

  if (!userRelatedProjects) {
    throw createCustomError('GENERIC', 'NOT_FOUND')
  }

  return userRelatedProjects
})
