/**
 * Reminders Controller - REST API für Erinnerungs-Verwaltung (A1: CRUD)
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
import { RemindersService } from './reminders.service';
import { CreateReminderDto, UpdateReminderDto } from './dto/reminder.dto';
import { RolesGuard } from '../../guards/roles.guard';

@ApiTags('reminders')
@ApiSecurity('X-Role')
@Controller('reminders')
@UseGuards(RolesGuard)
export class RemindersController {
    constructor(private readonly remindersService: RemindersService) { }

    @Get()
    @ApiOperation({ summary: 'Alle Erinnerungen auflisten' })
    @ApiQuery({ name: 'subscriptionId', required: false, description: 'Filter nach Abonnement' })
    @ApiResponse({ status: 200, description: 'Liste aller Erinnerungen' })
    findAll(@Query('subscriptionId') subscriptionId?: string) {
        if (subscriptionId) {
            return this.remindersService.findBySubscription(subscriptionId);
        }
        return this.remindersService.findAll();
    }

    @Get('due')
    @ApiOperation({ summary: 'Fällige Erinnerungen abrufen' })
    @ApiQuery({ name: 'date', required: false, description: 'Datum für Fälligkeit (YYYY-MM-DD)' })
    @ApiResponse({ status: 200, description: 'Liste fälliger Erinnerungen' })
    findDue(@Query('date') date?: string) {
        const targetDate = date || new Date().toISOString().split('T')[0];
        return this.remindersService.findDueReminders(targetDate);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Einzelne Erinnerung abrufen' })
    @ApiParam({ name: 'id', description: 'Erinnerungs-UUID' })
    @ApiResponse({ status: 200, description: 'Erinnerung gefunden' })
    @ApiResponse({ status: 404, description: 'Erinnerung nicht gefunden' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.remindersService.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Neue Erinnerung erstellen' })
    @ApiResponse({ status: 201, description: 'Erinnerung erfolgreich erstellt' })
    @ApiResponse({ status: 400, description: 'Ungültige Eingabedaten' })
    create(@Body() createReminderDto: CreateReminderDto) {
        return this.remindersService.create(createReminderDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Erinnerung aktualisieren' })
    @ApiParam({ name: 'id', description: 'Erinnerungs-UUID' })
    @ApiResponse({ status: 200, description: 'Erinnerung erfolgreich aktualisiert' })
    @ApiResponse({ status: 404, description: 'Erinnerung nicht gefunden' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateReminderDto: UpdateReminderDto,
    ) {
        return this.remindersService.update(id, updateReminderDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Erinnerung löschen' })
    @ApiParam({ name: 'id', description: 'Erinnerungs-UUID' })
    @ApiResponse({ status: 204, description: 'Erinnerung erfolgreich gelöscht' })
    @ApiResponse({ status: 404, description: 'Erinnerung nicht gefunden' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.remindersService.remove(id);
    }
}
