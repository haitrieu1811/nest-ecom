export const ROLE_NAME = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SELLER: 'SELLER',
  CLIENT: 'CLIENT',
} as const

export type RoleNameType = keyof typeof ROLE_NAME
