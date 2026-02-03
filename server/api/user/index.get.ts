import { and, ilike, ne } from 'drizzle-orm'
import { userTable } from '~~/server/db/schema/auth-schema'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'
import type { User } from '~~/server/types'
import { userSelectSchema } from '~~/server/utils/validator'

const routeQueryParamsValidator = userSelectSchema.pick({ email: true })

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code'],
    })
  }

  const validationResult = await getValidatedQuery(
    event,
    routeQueryParamsValidator.safeParse
  )

  if (!validationResult.success) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        ...GENERIC_ERRORS['BAD_REQUEST'],
        scope: 'GENERIC',
      },
    })
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
