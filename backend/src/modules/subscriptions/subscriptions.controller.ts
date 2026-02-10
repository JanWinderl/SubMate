/**
 * Subscriptions Controller - REST API für Abo-Verwaltung (A1: CRUD)
 */
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
    UseGuards,
    Headers,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiSecurity,
    ApiHeader,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { UserRole } from '../../entities/user.entity';

@ApiTags('subscriptions')
@ApiSecurity('X-Role')
@ApiHeader({ name: 'X-User-Id', description: 'Benutzer-ID für Zugriffsprüfung', required: false })
@Controller('subscriptions')
@UseGuards(RolesGuard)
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @Get()
    @ApiOperation({ summary: 'Alle Abonnements auflisten' })
    @ApiResponse({ status: 200, description: 'Liste der Abonnements (gefiltert nach Rolle)' })
    findAll(
        @Headers('x-role') role: UserRole = 'user',
        @Headers('x-user-id') userId?: string,
    ) {
        return this.subscriptionsService.findAll(userId, role);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Einzelnes Abonnement abrufen' })
    @ApiParam({ name: 'id', description: 'Abonnement-UUID' })
    @ApiResponse({ status: 200, description: 'Abonnement gefunden' })
    @ApiResponse({ status: 403, description: 'Kein Zugriff auf dieses Abonnement' })
    @ApiResponse({ status: 404, description: 'Abonnement nicht gefunden' })
    findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @Headers('x-role') role: UserRole = 'user',
        @Headers('x-user-id') userId?: string,
    ) {
        return this.subscriptionsService.findOne(id, userId, role);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Neues Abonnement erstellen' })
    @ApiResponse({ status: 201, description: 'Abonnement erfolgreich erstellt' })
    @ApiResponse({ status: 400, description: 'Ungültige Eingabedaten' })
    create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
        return this.subscriptionsService.create(createSubscriptionDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Abonnement aktualisieren' })
    @ApiParam({ name: 'id', description: 'Abonnement-UUID' })
    @ApiResponse({ status: 200, description: 'Abonnement erfolgreich aktualisiert' })
    @ApiResponse({ status: 403, description: 'Keine Berechtigung zur Bearbeitung' })
    @ApiResponse({ status: 404, description: 'Abonnement nicht gefunden' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateSubscriptionDto: UpdateSubscriptionDto,
        @Headers('x-role') role: UserRole = 'user',
        @Headers('x-user-id') userId?: string,
    ) {
        return this.subscriptionsService.update(id, updateSubscriptionDto, userId, role);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Abonnement löschen' })
    @ApiParam({ name: 'id', description: 'Abonnement-UUID' })
    @ApiResponse({ status: 204, description: 'Abonnement erfolgreich gelöscht' })
    @ApiResponse({ status: 403, description: 'Keine Berechtigung zum Löschen' })
    @ApiResponse({ status: 404, description: 'Abonnement nicht gefunden' })
    remove(
        @Param('id', ParseUUIDPipe) id: string,
        @Headers('x-role') role: UserRole = 'user',
        @Headers('x-user-id') userId?: string,
    ) {
        return this.subscriptionsService.remove(id, userId, role);
    }
}
