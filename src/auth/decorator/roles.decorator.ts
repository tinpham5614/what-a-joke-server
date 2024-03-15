import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/schema/user.schema';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
