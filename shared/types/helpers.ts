export type AllKeys<T extends object> = T extends T ? keyof T : never
