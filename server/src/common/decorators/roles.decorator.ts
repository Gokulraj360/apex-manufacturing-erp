import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorator to enforce Role-Based Access Control on endpoints.
 * @example
 * @Roles(Role.SUPER_ADMIN, Role.PLANT_MANAGER)
 * @Get()
 * findAll()
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
