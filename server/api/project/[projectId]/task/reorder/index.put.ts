import { eq } from 'drizzle-orm'
import { readValidatedBody } from 'h3'
import { z } from 'zod'
import { projectTaskTable, taskState } from '~~/server/db/schema/project-task'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'

const routerBodyValidator = z.array(
  z.object({
    id: z.cuid2(),
    name: z.string(),
    state: z.enum(taskState.enumValues),
    description: z.string(),
    order: z.number().min(1)
  })
)

export default defineEventHandler(async (event) => {
  const validatedBody = await readValidatedBody(
    event,
    routerBodyValidator.safeParse
  )

  if (!validatedBody.success) {
    console.log(z.prettifyError(validatedBody.error))

    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        ...GENERIC_ERRORS['BAD_REQUEST'],
        reason: 'Request payload failed validation',
        scope: 'GENERIC',
      },
    })
  }

  const data = validatedBody.data
  try {
    await db.transaction(async (tx) => {
      try {
        const tasksPromise = data.toReversed().map(async (pTask) => {
          if (pTask.id) {
            return tx
              .update(projectTaskTable)
              .set({
                name: pTask.name,
                description: pTask.description,
                order: pTask.order,
                state: pTask.state
              })
              .where(eq(projectTaskTable.id, pTask.id))
              .returning()
          }
        })
        await Promise.all(tasksPromise)
      } catch {
        tx.rollback()
      }
    }, {
      deferrable: true,
    })
  } catch (error) {
    console.log(error)
    throw error
  }

  return ''
})
