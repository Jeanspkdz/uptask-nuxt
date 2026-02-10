import { and, eq } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
import { createCustomError } from '~~/server/errors'
import type { User } from '~~/server/types'
import { projectInsertchema } from '~~/server/utils/validator'

const routeBodyValidator = projectInsertchema.pick({
  name: true,
  clientName: true,
  description: true,
})

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createCustomError('GENERIC', 'UNAUTHORIZED')
  }
  const bodyValidationResult = await readValidatedBody(
    event,
    routeBodyValidator.safeParse
  )

  if (!bodyValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { data } = bodyValidationResult

  // Check if an project with the name and ClientName already exists
  const foundProject = await db
    .select()
    .from(projectTable)
    .where(
      and(
        eq(projectTable.name, data.name),
        eq(projectTable.clientName, data.clientName)
      )
    )

  if (foundProject.length > 0) {
    throw createCustomError('PROJECT', 'NAME_AND_CLIENT_NAME_ALREADY_EXISTS')
  }

  const insertedProject = await db
    .insert(projectTable)
    .values({
      clientName: data.clientName,
      name: data.name,
      description: data.description,
      userId: userAuthenticated.id,
    })
    .returning()

  return {
    insertedProject,
  }
})
