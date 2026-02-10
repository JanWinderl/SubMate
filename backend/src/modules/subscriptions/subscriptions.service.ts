/**
 * Subscriptions Service - Geschäftslogik für Abo-Verwaltung
 */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../entities/subscription.entity';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { UserRole } from '../../entities/user.entity';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription)
        private subscriptionsRepository: Repository<Subscription>,
    ) { }

    async findAll(userId?: string, userRole?: UserRole): Promise<Subscription[]> {
        // Admins sehen alle Abos, andere nur ihre eigenen
        if (userRole === 'admin') {
            return this.subscriptionsRepository.find({
                relations: ['category', 'user', 'reminders'],
            });
        }

        return this.subscriptionsRepository.find({
            where: { userId },
            relations: ['category', 'user', 'reminders'],
        });
    }

    async findOne(id: string, userId?: string, userRole?: UserRole): Promise<Subscription> {
        const subscription = await this.subscriptionsRepository.findOne({
            where: { id },
            relations: ['category', 'user', 'reminders'],
        });

        if (!subscription) {
            throw new NotFoundException(`Abonnement mit ID ${id} nicht gefunden`);
        }

        // Prüfe Berechtigung
        if (userRole !== 'admin' && subscription.userId !== userId) {
            // Prüfe ob User im sharedWith Array ist
            const isShared = subscription.sharedWith?.includes(userId || '');
            if (!isShared) {
                throw new ForbiddenException('Sie haben keinen Zugriff auf dieses Abonnement');
            }
        }

        return subscription;
    }

    async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
        const subscription = this.subscriptionsRepository.create(createSubscriptionDto);
        return this.subscriptionsRepository.save(subscription);
    }

    async update(
        id: string,
        updateSubscriptionDto: UpdateSubscriptionDto,
        userId?: string,
        userRole?: UserRole,
    ): Promise<Subscription> {
        const subscription = await this.findOne(id, userId, userRole);

        // Nur Owner oder Admin kann bearbeiten
        if (userRole !== 'admin' && subscription.userId !== userId) {
            throw new ForbiddenException('Nur der Besitzer kann dieses Abonnement bearbeiten');
        }

        Object.assign(subscription, updateSubscriptionDto);
        return this.subscriptionsRepository.save(subscription);
    }

    async remove(id: string, userId?: string, userRole?: UserRole): Promise<void> {
        const subscription = await this.findOne(id, userId, userRole);

        // Nur Owner oder Admin kann löschen
        if (userRole !== 'admin' && subscription.userId !== userId) {
            throw new ForbiddenException('Nur der Besitzer kann dieses Abonnement löschen');
        }

        await this.subscriptionsRepository.remove(subscription);
    }

    /**
     * A2:Action - Teilt ein Abonnement mit anderen Benutzern (nur Premium/Admin)
     */
    async shareSubscription(
        id: string,
        targetUserIds: string[],
        userId: string,
        userRole: UserRole,
    ): Promise<Subscription> {
        // Nur Premium oder Admin können teilen
        if (userRole === 'user') {
            throw new ForbiddenException('Das Teilen von Abos ist nur für Premium-Nutzer verfügbar');
        }

        const subscription = await this.findOne(id, userId, userRole);

        // Nur Owner kann teilen
        if (subscription.userId !== userId && userRole !== 'admin') {
            throw new ForbiddenException('Nur der Besitzer kann dieses Abonnement teilen');
        }

        subscription.sharedWith = [...new Set([...(subscription.sharedWith || []), ...targetUserIds])];
        return this.subscriptionsRepository.save(subscription);
    }

    /**
     * Hilfsmethode für Actions-Modul
     */
    async findByUserId(userId: string): Promise<Subscription[]> {
        return this.subscriptionsRepository.find({
            where: { userId, isActive: true },
            relations: ['category'],
        });
    }
}
