export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  GEST = 'GEST',
}

export const RoleLevel: Record<Role, Number> = {
  [Role.ADMIN]: 3,
  [Role.USER]: 2,
  [Role.GEST]: 1,
};
