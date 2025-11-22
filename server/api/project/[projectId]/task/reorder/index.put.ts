import { eq } from 'drizzle-orm'
import { readValidatedBody } from 'h3'
import { z } from 'zod'
import { projectTaskTable, taskState } from '~~/server/db/schema/project-task'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'

//  id: task.id,
//         name: task.name,
//         state: task.state,
//         description: task.description,

const routerBodyValidator = z.array(
  z.object({
    id: z.cuid2(),
    name: z.string(),
    state: z.enum(taskState.enumValues),
    description: z.string(),
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

  const updatedProjectTasks = await db.transaction(async (tx) => {
    const updatedTaskPromise = data.map(async (pTask) => {
      if (pTask.id) {
        return tx
          .update(projectTaskTable)
          .set(pTask)
          .where(eq(projectTaskTable.id, pTask.id))
          .returning()
      }
      tx.rollback()
    })
    return await Promise.all(updatedTaskPromise)
  })

  return updatedProjectTasks
})
