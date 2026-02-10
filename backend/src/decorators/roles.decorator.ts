/**
 * Roles Decorator - Markiert Endpunkte mit erforderlichen Rollen
 * 
 * Verwendung: @Roles('admin', 'premium')
 * Der RolesGuard prüft dann, ob der User die richtige Rolle hat.
 */
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
