export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  clientName: string
  description: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type TaskState =
  | 'pending'
  | 'waiting'
  | 'in_progress'
  | 'in_review'
  | 'completed'

export interface ProjectTask {
  id: string
  name: string
  description: string
  state: TaskState
  order: number
  projectId: string
  createdAt: Date
  updatedAt: Date
}

export interface TaskNote {
  id: string
  description: string
  taskId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}
