/**
 * Categories Service - Geschäftslogik für Kategorie-Verwaltung
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    async findAll(): Promise<Category[]> {
        return this.categoriesRepository.find({
            relations: ['subscriptions'],
        });
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['subscriptions'],
        });
        if (!category) {
            throw new NotFoundException(`Kategorie mit ID ${id} nicht gefunden`);
        }
        return category;
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        // Prüfe ob Name bereits existiert
        const existing = await this.categoriesRepository.findOne({
            where: { name: createCategoryDto.name },
        });
        if (existing) {
            throw new ConflictException(`Kategorie "${createCategoryDto.name}" existiert bereits`);
        }

        const category = this.categoriesRepository.create(createCategoryDto);
        return this.categoriesRepository.save(category);
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);

        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existing = await this.categoriesRepository.findOne({
                where: { name: updateCategoryDto.name },
            });
            if (existing) {
                throw new ConflictException(`Kategorie "${updateCategoryDto.name}" existiert bereits`);
            }
        }

        Object.assign(category, updateCategoryDto);
        return this.categoriesRepository.save(category);
    }

    async remove(id: string): Promise<void> {
        const category = await this.findOne(id);
        await this.categoriesRepository.remove(category);
    }

    /**
     * Erstellt Standard-Kategorien falls keine existieren
     */
    async seedDefaultCategories(): Promise<void> {
        const count = await this.categoriesRepository.count();
        if (count === 0) {
            const defaults: CreateCategoryDto[] = [
                { name: 'Streaming', icon: 'play-circle', color: '#8b5cf6' },
                { name: 'Software', icon: 'code', color: '#3b82f6' },
                { name: 'Fitness', icon: 'dumbbell', color: '#10b981' },
                { name: 'Cloud', icon: 'cloud', color: '#06b6d4' },
                { name: 'Gaming', icon: 'gamepad-2', color: '#f59e0b' },
                { name: 'News', icon: 'newspaper', color: '#64748b' },
                { name: 'Musik', icon: 'music', color: '#ec4899' },
                { name: 'Sonstiges', icon: 'box', color: '#6b7280' },
            ];

            for (const dto of defaults) {
                const category = this.categoriesRepository.create(dto);
                await this.categoriesRepository.save(category);
            }
        }
    }
}
