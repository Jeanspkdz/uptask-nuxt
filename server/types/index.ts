import type { projectTable } from '@@/server/db/schema/project'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import type { projectTaskTable, taskState } from '../db/schema/project-task'

export type AuthSession = typeof auth.$Infer.Session
export type User = AuthSession['user']
export type SessionInfo = AuthSession['session']

export type Project = InferSelectModel<typeof projectTable>
export type ProjectInsert = typeof projectTable.$inferInsert
export type ProjectUpdate = Pick<ProjectInsert, 'clientName' | 'name' | 'description'>

export type Task = InferSelectModel<typeof projectTaskTable>
export type TaskInsert = InferInsertModel<typeof projectTaskTable>
export type TaskUpdate = Partial<Task>

export type TaskState = typeof taskState.enumValues[number]
