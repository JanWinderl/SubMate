/**
 * Categories Controller - REST API für Kategorie-Verwaltung (A1: CRUD)
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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@ApiTags('categories')
@ApiSecurity('X-Role')
@Controller('categories')
@UseGuards(RolesGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @ApiOperation({ summary: 'Alle Kategorien auflisten' })
    @ApiResponse({ status: 200, description: 'Liste aller Kategorien' })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Einzelne Kategorie abrufen' })
    @ApiParam({ name: 'id', description: 'Kategorie-UUID' })
    @ApiResponse({ status: 200, description: 'Kategorie gefunden' })
    @ApiResponse({ status: 404, description: 'Kategorie nicht gefunden' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.categoriesService.findOne(id);
    }

    @Post()
    @Roles('admin')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Neue Kategorie erstellen' })
    @ApiResponse({ status: 201, description: 'Kategorie erfolgreich erstellt' })
    @ApiResponse({ status: 400, description: 'Ungültige Eingabedaten' })
    @ApiResponse({ status: 403, description: 'Nur Admins können Kategorien erstellen' })
    @ApiResponse({ status: 409, description: 'Kategorie existiert bereits' })
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Patch(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Kategorie aktualisieren' })
    @ApiParam({ name: 'id', description: 'Kategorie-UUID' })
    @ApiResponse({ status: 200, description: 'Kategorie erfolgreich aktualisiert' })
    @ApiResponse({ status: 400, description: 'Ungültige Eingabedaten' })
    @ApiResponse({ status: 403, description: 'Nur Admins können Kategorien bearbeiten' })
    @ApiResponse({ status: 404, description: 'Kategorie nicht gefunden' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @Roles('admin')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Kategorie löschen' })
    @ApiParam({ name: 'id', description: 'Kategorie-UUID' })
    @ApiResponse({ status: 204, description: 'Kategorie erfolgreich gelöscht' })
    @ApiResponse({ status: 403, description: 'Nur Admins können Kategorien löschen' })
    @ApiResponse({ status: 404, description: 'Kategorie nicht gefunden' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.categoriesService.remove(id);
    }

    @Post('seed')
    @Roles('admin')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Standard-Kategorien erstellen' })
    @ApiResponse({ status: 201, description: 'Standard-Kategorien erstellt' })
    @ApiResponse({ status: 403, description: 'Nur Admins können Kategorien seeden' })
    seed() {
        return this.categoriesService.seedDefaultCategories();
    }
}
