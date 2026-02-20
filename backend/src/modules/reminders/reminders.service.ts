/**
 * Reminders Service - Geschäftslogik für Erinnerungs-Verwaltung
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Reminder } from '../../entities/reminder.entity';
import { CreateReminderDto, UpdateReminderDto } from './dto/reminder.dto';

@Injectable()
export class RemindersService {
    constructor(
        @InjectRepository(Reminder)
        private remindersRepository: Repository<Reminder>,
    ) { }

    async findAll(): Promise<Reminder[]> {
        return this.remindersRepository.find({
            relations: ['subscription'],
        });
    }

    async findOne(id: string): Promise<Reminder> {
        const reminder = await this.remindersRepository.findOne({
            where: { id },
            relations: ['subscription'],
        });
        if (!reminder) {
            throw new NotFoundException(`Erinnerung mit ID ${id} nicht gefunden`);
        }
        return reminder;
    }

    async findBySubscription(subscriptionId: string): Promise<Reminder[]> {
        return this.remindersRepository.find({
            where: { subscriptionId },
            relations: ['subscription'],
        });
    }

    async findDueReminders(date: string): Promise<Reminder[]> {
        return this.remindersRepository.find({
            where: {
                reminderDate: LessThanOrEqual(date),
                isActive: true,
            },
            relations: ['subscription'],
        });
    }

    async create(createReminderDto: CreateReminderDto): Promise<Reminder> {
        const reminder = this.remindersRepository.create(createReminderDto);
        return this.remindersRepository.save(reminder);
    }

    async update(id: string, updateReminderDto: UpdateReminderDto): Promise<Reminder> {
        const reminder = await this.findOne(id);
        Object.assign(reminder, updateReminderDto);
        return this.remindersRepository.save(reminder);
    }

    async remove(id: string): Promise<void> {
        const reminder = await this.findOne(id);
        await this.remindersRepository.remove(reminder);
    }

    /**
     * A2:Action - Deaktiviert alle Erinnerungen für ein Abonnement
     */
    async cancelRemindersBySubscription(subscriptionId: string): Promise<number> {
        const result = await this.remindersRepository.update(
            { subscriptionId, isActive: true },
            { isActive: false },
        );
        return result.affected || 0;
    }
}
