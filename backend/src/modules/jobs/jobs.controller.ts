/**
 * Jobs Controller - REST API für asynchrone Operationen (A4: Jobsystem)
 * 
 * Gemäß Azure API Long Running Operations Guidelines:
 * - POST zum Starten eines Jobs → 202 Accepted + Job-ID
 * - GET zum Abfragen des Status → Status, Progress, Result/Error
 */
import {
    Controller,
    Get,
    Post,
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
} from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import {
    StartExportJobDto,
    StartImportJobDto,
    JobCreatedResponseDto,
    JobStatusResponseDto,
} from './dto/jobs.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@ApiTags('jobs')
@ApiSecurity('X-Role')
@Controller('jobs')
@UseGuards(RolesGuard)
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Post('export-subscriptions')
    @Roles('premium', 'admin')
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiOperation({
        summary: 'Starte Export-Job',
        description:
            'A4:Job - Startet einen Hintergrund-Job zum Export aller Abonnements. ' +
            'Gibt sofort 202 Accepted mit Job-ID zurück. Status über /jobs/:id/status abrufbar.',
    })
    @ApiResponse({
        status: 202,
        description: 'Job gestartet',
        type: JobCreatedResponseDto,
    })
    @ApiResponse({ status: 403, description: 'Nur Premium/Admin können exportieren' })
    async startExportJob(
        @Body() dto: StartExportJobDto,
    ): Promise<JobCreatedResponseDto> {
        const job = await this.jobsService.createJob('export_subscriptions', dto.userId);
        return {
            jobId: job.id,
            message: 'Export-Job wurde erstellt und wird im Hintergrund ausgeführt',
            statusUrl: `/jobs/${job.id}/status`,
        };
    }

    @Post('check-reminders')
    @Roles('admin')
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiOperation({
        summary: 'Starte Erinnerungs-Check-Job',
        description:
            'A4:Job - Startet einen Hintergrund-Job zur Prüfung fälliger Erinnerungen. ' +
            'Gibt sofort 202 Accepted mit Job-ID zurück.',
    })
    @ApiResponse({
        status: 202,
        description: 'Job gestartet',
        type: JobCreatedResponseDto,
    })
    @ApiResponse({ status: 403, description: 'Nur Admin kann Reminder-Check starten' })
    async startReminderCheckJob(
        @Headers('x-user-id') userId: string,
    ): Promise<JobCreatedResponseDto> {
        const job = await this.jobsService.createJob('check_reminders', userId || 'system');
        return {
            jobId: job.id,
            message: 'Erinnerungs-Check wurde gestartet und läuft im Hintergrund',
            statusUrl: `/jobs/${job.id}/status`,
        };
    }

    @Post('import-data')
    @Roles('premium', 'admin')
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiOperation({
        summary: 'Starte Import-Job',
        description:
            'A4:Job - Startet einen Hintergrund-Job zum Import von Abonnements. ' +
            'Die Daten werden als Liste im Request Body übergeben.',
    })
    @ApiResponse({
        status: 202,
        description: 'Job gestartet',
        type: JobCreatedResponseDto,
    })
    @ApiResponse({ status: 403, description: 'Nur Premium/Admin können importieren' })
    async startImportJob(
        @Body() dto: StartImportJobDto,
    ): Promise<JobCreatedResponseDto> {
        const job = await this.jobsService.executeImportJob(dto.userId, dto.subscriptions);
        return {
            jobId: job.id,
            message: 'Import-Job wurde erstellt und wird im Hintergrund ausgeführt',
            statusUrl: `/jobs/${job.id}/status`,
        };
    }

    @Get(':id/status')
    @ApiOperation({
        summary: 'Job-Status abrufen',
        description:
            'Ruft den aktuellen Status eines Hintergrund-Jobs ab. ' +
            'Enthält Status (pending/running/completed/failed), Progress (0-100), Result oder Error.',
    })
    @ApiParam({ name: 'id', description: 'Job-UUID' })
    @ApiResponse({
        status: 200,
        description: 'Job-Status',
        type: JobStatusResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Job nicht gefunden' })
    async getJobStatus(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<JobStatusResponseDto> {
        const job = await this.jobsService.getJobStatus(id);
        return {
            id: job.id,
            type: job.type,
            status: job.status,
            progress: job.progress,
            result: job.result || undefined,
            error: job.error || undefined,
            createdAt: job.createdAt.toISOString(),
            completedAt: job.completedAt?.toISOString(),
        };
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Alle Jobs eines Benutzers abrufen' })
    @ApiParam({ name: 'userId', description: 'Benutzer-UUID' })
    @ApiResponse({ status: 200, description: 'Liste der Jobs' })
    async getJobsByUser(@Param('userId', ParseUUIDPipe) userId: string) {
        return this.jobsService.getJobsByUser(userId);
    }
}
