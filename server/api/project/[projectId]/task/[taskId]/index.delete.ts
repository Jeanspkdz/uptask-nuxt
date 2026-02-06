import { and, eq, gt } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
import { projectTaskTable } from '~~/server/db/schema/project-task'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'
import type { User } from '~~/server/types'
import { routeParamsSchema } from '~~/server/utils/validator'

const routerParamsValidator = routeParamsSchema.pick({
  projectId: true,
  taskId: true,
})

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code'],
    })
  }

  const validatedParamsResult = await getValidatedRouterParams(
    event,
    routerParamsValidator.safeParse
  )

  if (!validatedParamsResult.success) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        ...GENERIC_ERRORS['BAD_REQUEST'],
        scope: 'GENERIC',
      },
    })
  }

  const { projectId, taskId } = validatedParamsResult.data

  // Check if the user is the project owner
  const [project] = await db
    .select()
    .from(projectTable)
    .where(
      and(
        eq(projectTable.id, projectId),
        eq(projectTable.userId, userAuthenticated.id)
      )
    )

  if (!project) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['FORBIDDEN']['code'],
      data: {
        ...GENERIC_ERRORS['FORBIDDEN'],
        scope: 'GENERIC',
      },
    })
  }

  const deletedTask = await db.transaction(async (tx) => {
    // DELETE TASK
    const [deletedTransactionTask] = await tx
      .delete(projectTaskTable)
      .where(eq(projectTaskTable.id, taskId))
      .returning()

    if (deletedTransactionTask) {
      // Reorder task from the source column
      const subsequentTasks = await tx
        .select()
        .from(projectTaskTable)
        .where(
          and(
            eq(projectTaskTable.projectId, projectId),
            eq(projectTaskTable.state, deletedTransactionTask.state),
            gt(projectTaskTable.order, deletedTransactionTask.order)
          )
        )

      const tasksPromise = subsequentTasks.map(async (task) => {
        return await tx
          .update(projectTaskTable)
          .set({ order: task.order - 1 })
          .where(eq(projectTaskTable.id, task.id))
          .returning()
      })
      await Promise.all(tasksPromise)
    }

    return deletedTransactionTask
  })

  return {
    deletedTask,
  }
})
