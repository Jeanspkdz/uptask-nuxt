import type { project } from '@@/server/db/schema/project'
import type { InferSelectModel } from 'drizzle-orm'

export type AuthSession = typeof auth.$Infer.Session
export type User = AuthSession['user']
export type SessionInfo = AuthSession['session']

export type Project = InferSelectModel<typeof project>
export type ProjectInsert = typeof project.$inferInsert
export type ProjectUpdate = Pick<ProjectInsert, 'clientName' | 'name' | 'description'>
