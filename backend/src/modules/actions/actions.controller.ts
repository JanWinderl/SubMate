/**
 * Actions Controller - REST API für Aktionen (A2: Aktionen mit Daten)
 * 
 * Endpunkte:
 * - POST /actions/cost-analysis     - Kostenanalyse berechnen
 * - POST /actions/share/:id         - Abonnement teilen (Premium/Admin)
 * - POST /actions/cancel-reminders  - Erinnerungen deaktivieren
 */
import {
    Controller,
    Post,
    Body,
    Param,
    ParseUUIDPipe,
    UseGuards,
    Headers,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiSecurity,
} from '@nestjs/swagger';
import { ActionsService } from './actions.service';
import {
    ShareSubscriptionDto,
    CostAnalysisResponseDto,
    CancelRemindersDto,
    CancelRemindersResponseDto,
} from './dto/actions.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('actions')
@ApiSecurity('X-Role')
@Controller('actions')
@UseGuards(RolesGuard)
export class ActionsController {
    constructor(private readonly actionsService: ActionsService) { }

    @Post('cost-analysis')
    @ApiOperation({
        summary: 'Kostenanalyse berechnen',
        description:
            'A2:Action - Berechnet detaillierte Kostenanalyse für einen Benutzer. ' +
            'Umfasst monatliche/jährliche Kosten, Kosten pro Person und Aufschlüsselung nach Kategorie.',
    })
    @ApiQuery({ name: 'userId', description: 'Benutzer-ID für die Analyse' })
    @ApiQuery({ name: 'householdSize', required: false, description: 'Haushaltsgröße überschreiben' })
    @ApiResponse({ status: 200, description: 'Kostenanalyse', type: CostAnalysisResponseDto })
    getCostAnalysis(
        @Query('userId', ParseUUIDPipe) userId: string,
        @Query('householdSize') householdSize?: string,
    ): Promise<CostAnalysisResponseDto> {
        return this.actionsService.getCostAnalysis(
            userId,
            householdSize ? parseInt(householdSize, 10) : undefined,
        );
    }

    @Post('share/:id')
    @Roles('premium', 'admin')
    @ApiOperation({
        summary: 'Abonnement teilen',
        description:
            'A2:Action - Teilt ein Abonnement mit anderen Benutzern. ' +
            'Nur für Premium-Nutzer und Admins verfügbar.',
    })
    @ApiParam({ name: 'id', description: 'Abonnement-UUID' })
    @ApiResponse({ status: 200, description: 'Abonnement erfolgreich geteilt' })
    @ApiResponse({ status: 403, description: 'Nur Premium-Nutzer können teilen' })
    @ApiResponse({ status: 404, description: 'Abonnement nicht gefunden' })
    shareSubscription(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() shareDto: ShareSubscriptionDto,
        @Headers('x-role') role: UserRole = 'user',
        @Headers('x-user-id') userId?: string,
    ) {
        return this.actionsService.shareSubscription(
            id,
            shareDto.targetUserIds,
            userId || '',
            role,
        );
    }

    @Post('cancel-reminders')
    @ApiOperation({
        summary: 'Erinnerungen stornieren',
        description:
            'A2:Action - Deaktiviert alle aktiven Erinnerungen für ein bestimmtes Abonnement.',
    })
    @ApiResponse({ status: 200, description: 'Erinnerungen deaktiviert', type: CancelRemindersResponseDto })
    cancelReminders(
        @Body() cancelDto: CancelRemindersDto,
    ): Promise<CancelRemindersResponseDto> {
        return this.actionsService.cancelReminders(cancelDto.subscriptionId);
    }
}
