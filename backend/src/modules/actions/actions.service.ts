/**
 * Actions Service - Geschäftslogik für Aktionen (A2: Aktionen mit Daten)
 * 
 * Implementiert:
 * 1. Kostenanalyse - Berechnet Kosten pro Monat/Jahr/Person/Kategorie
 * 2. Abo teilen - Teilt ein Abonnement mit anderen Benutzern
 * 3. Erinnerungen stornieren - Deaktiviert alle Erinnerungen für ein Abo
 */
import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, BillingCycle } from '../../entities/subscription.entity';
import { User, UserRole } from '../../entities/user.entity';
import { RemindersService } from '../reminders/reminders.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { CostAnalysisResponseDto, CancelRemindersResponseDto } from './dto/actions.dto';

@Injectable()
export class ActionsService {
    constructor(
        @InjectRepository(Subscription)
        private subscriptionsRepository: Repository<Subscription>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private remindersService: RemindersService,
        private subscriptionsService: SubscriptionsService,
    ) { }

    /**
     * A2:Action - Berechnet detaillierte Kostenanalyse für einen Benutzer
     */
    async getCostAnalysis(userId: string, householdSize?: number): Promise<CostAnalysisResponseDto> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const effectiveHouseholdSize = householdSize || user?.householdSize || 1;

        const subscriptions = await this.subscriptionsRepository.find({
            where: { userId, isActive: true },
            relations: ['category'],
        });

        let totalMonthly = 0;
        const byCategory: Record<string, number> = {};
        const upcomingPayments: Array<{
            subscriptionId: string;
            subscriptionName: string;
            dueDate: string;
            amount: number;
        }> = [];

        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        for (const sub of subscriptions) {
            const monthlyPrice = this.convertToMonthly(sub.price, sub.billingCycle);
            totalMonthly += monthlyPrice;

            // Kosten nach Kategorie aggregieren
            const categoryName = sub.category?.name || 'Sonstiges';
            byCategory[categoryName] = (byCategory[categoryName] || 0) + monthlyPrice;

            // Anstehende Zahlungen in den nächsten 30 Tagen
            const nextBilling = new Date(sub.nextBillingDate);
            if (nextBilling >= today && nextBilling <= thirtyDaysFromNow) {
                upcomingPayments.push({
                    subscriptionId: sub.id,
                    subscriptionName: sub.name,
                    dueDate: sub.nextBillingDate,
                    amount: sub.price,
                });
            }
        }

        // Sortiere anstehende Zahlungen nach Datum
        upcomingPayments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        return {
            totalMonthly: Math.round(totalMonthly * 100) / 100,
            totalYearly: Math.round(totalMonthly * 12 * 100) / 100,
            perPersonMonthly: Math.round((totalMonthly / effectiveHouseholdSize) * 100) / 100,
            perPersonYearly: Math.round((totalMonthly * 12 / effectiveHouseholdSize) * 100) / 100,
            byCategory,
            upcomingPayments,
        };
    }

    /**
     * A2:Action - Teilt ein Abonnement mit anderen Benutzern (nur Premium/Admin)
     */
    async shareSubscription(
        subscriptionId: string,
        targetUserIds: string[],
        userId: string,
        userRole: UserRole,
    ): Promise<Subscription> {
        return this.subscriptionsService.shareSubscription(
            subscriptionId,
            targetUserIds,
            userId,
            userRole,
        );
    }

    /**
     * A2:Action - Deaktiviert alle Erinnerungen für ein Abonnement
     */
    async cancelReminders(subscriptionId: string): Promise<CancelRemindersResponseDto> {
        const cancelledCount = await this.remindersService.cancelRemindersBySubscription(subscriptionId);
        return {
            cancelledCount,
            message: `Erfolgreich ${cancelledCount} Erinnerung${cancelledCount !== 1 ? 'en' : ''} deaktiviert`,
        };
    }

    /**
     * Hilfsmethode: Konvertiert Preis zu monatlichem Äquivalent
     */
    private convertToMonthly(price: number, cycle: BillingCycle): number {
        switch (cycle) {
            case 'weekly':
                return price * 4.33; // ~4.33 Wochen pro Monat
            case 'monthly':
                return price;
            case 'quarterly':
                return price / 3;
            case 'yearly':
                return price / 12;
            default:
                return price;
        }
    }
}
