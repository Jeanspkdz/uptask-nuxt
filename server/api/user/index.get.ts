import { and, ilike, ne } from 'drizzle-orm'
import { userTable } from '~~/server/db/schema/auth-schema'
import { createCustomError } from '~~/server/errors'
import type { User } from '~~/server/types'
import { userSelectSchema } from '~~/server/utils/validator'

const routeQueryParamsValidator = userSelectSchema.pick({ email: true })

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createCustomError('GENERIC', 'UNAUTHORIZED')
  }

  const validationResult = await getValidatedQuery(
    event,
    routeQueryParamsValidator.safeParse
  )

  if (!validationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { email } = validationResult.data

  const users = await db
    .select()
    .from(userTable)
    .where(
      and(
        ne(userTable.id, userAuthenticated.id),
        ilike(userTable.email, `%${email}%`)
      )
    )

  return users
})
