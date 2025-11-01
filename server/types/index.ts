import type { project } from '@@/server/db/schema/project'

export type AuthSession = typeof auth.$Infer.Session
export type AuthUser = AuthSession['user']
export type SessionInfo = AuthSession['session']

export type ProjectInsert = typeof project.$inferInsert
