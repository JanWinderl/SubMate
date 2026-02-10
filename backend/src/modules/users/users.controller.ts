/**
 * Users Controller - REST API für Benutzerverwaltung (A1: CRUD)
 * 
 * Endpunkte:
 * - GET    /users     - Alle Benutzer auflisten (nur Admin)
 * - GET    /users/:id - Einzelnen Benutzer abrufen
 * - POST   /users     - Neuen Benutzer erstellen (nur Admin)
 * - PATCH  /users/:id - Benutzer aktualisieren
 * - DELETE /users/:id - Benutzer löschen (nur Admin)
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
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiSecurity,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@ApiTags('users')
@ApiSecurity('X-Role')
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles('admin')
    @ApiOperation({ summary: 'Alle Benutzer auflisten' })
    @ApiResponse({ status: 200, description: 'Liste aller Benutzer' })
    @ApiResponse({ status: 403, description: 'Nur Admins können alle Benutzer sehen' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Einzelnen Benutzer abrufen' })
    @ApiParam({ name: 'id', description: 'Benutzer-UUID' })
    @ApiResponse({ status: 200, description: 'Benutzer gefunden' })
    @ApiResponse({ status: 404, description: 'Benutzer nicht gefunden' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.findOne(id);
    }

    @Post()
    @Roles('admin')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Neuen Benutzer erstellen' })
    @ApiResponse({ status: 201, description: 'Benutzer erfolgreich erstellt' })
    @ApiResponse({ status: 400, description: 'Ungültige Eingabedaten' })
    @ApiResponse({ status: 403, description: 'Nur Admins können Benutzer erstellen' })
    @ApiResponse({ status: 409, description: 'E-Mail bereits registriert' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Benutzer aktualisieren' })
    @ApiParam({ name: 'id', description: 'Benutzer-UUID' })
    @ApiResponse({ status: 200, description: 'Benutzer erfolgreich aktualisiert' })
    @ApiResponse({ status: 400, description: 'Ungültige Eingabedaten' })
    @ApiResponse({ status: 404, description: 'Benutzer nicht gefunden' })
    @ApiResponse({ status: 409, description: 'E-Mail bereits registriert' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Roles('admin')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Benutzer löschen' })
    @ApiParam({ name: 'id', description: 'Benutzer-UUID' })
    @ApiResponse({ status: 204, description: 'Benutzer erfolgreich gelöscht' })
    @ApiResponse({ status: 403, description: 'Nur Admins können Benutzer löschen' })
    @ApiResponse({ status: 404, description: 'Benutzer nicht gefunden' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.remove(id);
    }
}
