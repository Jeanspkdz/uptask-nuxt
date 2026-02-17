import { eq, sql } from 'drizzle-orm'
import { readValidatedBody } from 'h3'
import { FetchError } from 'ofetch'
import { z } from 'zod'
import { projectTaskTable } from '~~/server/db/schema/project-task'
import { createCustomError, type ErrorData } from '~~/server/errors'

const routeBodyValidator = z.array(projectTaskSelectSchema.pick({
  id: true,
  state: true,
  order: true,
}))

export default defineEventHandler(async (event) => {
  try {
    const validatedBody = await readValidatedBody(
      event,
      routeBodyValidator.safeParse
    )

    if (!validatedBody.success) {
      console.log(z.prettifyError(validatedBody.error))
      throw createCustomError('GENERIC', 'BAD_REQUEST')
    }

    const data = validatedBody.data
    console.log('DATA', data)

    const reorderedTasks = await db.transaction(
      async (tx) => {
        await tx.execute(
          sql`SET CONSTRAINTS project_tasks_project_id_order_state_unique DEFERRED`
        )

        const tasksPromise = data.map((pTask) => {
          return tx
            .update(projectTaskTable)
            .set({
              order: pTask.order,
              state: pTask.state,
            })
            .where(eq(projectTaskTable.id, pTask.id))
            .returning()
        })

        const results = await Promise.all(tasksPromise)
        return results.flat(1)
      },
      {
        deferrable: true, // ??
        isolationLevel: 'serializable',
      }
    )

    return reorderedTasks
  } catch (error) {
    console.log('[REORDER_TASKS_ERROR]', error)

    if (error instanceof FetchError) {
      throw createError<ErrorData>({
        ...error,
      })
    }

    throw createCustomError('GENERIC', 'UNKNOWN')
  }
})
