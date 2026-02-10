/**
 * Roles Guard - Prüft Benutzerrollen für geschützte Endpunkte (A3: Rollensystem)
 * 
 * Die Rolle wird über den X-Role HTTP Header übergeben.
 * Falls keine Rolle angegeben ist, wird 'user' als Standard verwendet.
 * 
 * HTTP Response Codes:
 * - 403 Forbidden: Wenn die Rolle nicht ausreicht
 */
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Hole die erforderlichen Rollen aus dem @Roles() Decorator
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        // Wenn keine Rollen erforderlich sind, Zugriff erlauben
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        // Hole die Rolle aus dem Request Header
        const request = context.switchToHttp().getRequest();
        const userRole = (request.headers['x-role'] as UserRole) || 'user';

        // Admin hat immer Zugriff
        if (userRole === 'admin') {
            return true;
        }

        // Prüfe ob die User-Rolle in den erforderlichen Rollen enthalten ist
        const hasRole = requiredRoles.includes(userRole);

        if (!hasRole) {
            throw new ForbiddenException(
                `Diese Aktion erfordert eine der folgenden Rollen: ${requiredRoles.join(', ')}. ` +
                `Ihre aktuelle Rolle ist: ${userRole}`,
            );
        }

        return true;
    }
}
