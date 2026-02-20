/**
 * Jobs Service - Geschäftslogik für asynchrone Operationen (A4: Jobsystem)
 * 
 * Implementiert laut Prüfungsanforderung:
 * - Jobs laufen im Hintergrund
 * - API gibt sofort Status 202 mit Job-ID zurück
 * - Separater Endpunkt für Statusabfrage (Status, Errors, Results)
 * 
 * Jobs:
 * 1. Export Subscriptions - Exportiert alle Abos als CSV-ähnliche Struktur
 * 2. Check Reminders - Prüft auf fällige Erinnerungen
 * 3. Import Data - Importiert Abonnements aus einer Liste
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Job, JobType, JobStatus } from '../../entities/job.entity';
import { Subscription } from '../../entities/subscription.entity';
import { Reminder } from '../../entities/reminder.entity';
import { Category } from '../../entities/category.entity';

@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(Job)
        private jobsRepository: Repository<Job>,
        @InjectRepository(Subscription)
        private subscriptionsRepository: Repository<Subscription>,
        @InjectRepository(Reminder)
        private remindersRepository: Repository<Reminder>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    /**
     * Erstellt einen neuen Job und startet die Ausführung im Hintergrund
     */
    async createJob(type: JobType, userId: string): Promise<Job> {
        const job = this.jobsRepository.create({
            type,
            userId,
            status: 'pending',
            progress: 0,
        });
        const savedJob = await this.jobsRepository.save(job);

        // Starte Job asynchron im Hintergrund (ohne await!)
        this.executeJob(savedJob.id);

        return savedJob;
    }

    /**
     * Ruft den Status eines Jobs ab
     */
    async getJobStatus(jobId: string): Promise<Job> {
        const job = await this.jobsRepository.findOne({ where: { id: jobId } });
        if (!job) {
            throw new NotFoundException(`Job mit ID ${jobId} nicht gefunden`);
        }
        return job;
    }

    /**
     * Alle Jobs eines Benutzers abrufen
     */
    async getJobsByUser(userId: string): Promise<Job[]> {
        return this.jobsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Führt einen Job im Hintergrund aus
     */
    private async executeJob(jobId: string): Promise<void> {
        const job = await this.jobsRepository.findOne({ where: { id: jobId } });
        if (!job) return;

        try {
            // Status auf "running" setzen
            await this.updateJobStatus(jobId, 'running', 10);

            let result: Record<string, unknown>;

            switch (job.type) {
                case 'export_subscriptions':
                    result = await this.executeExportJob(job.userId, jobId);
                    break;
                case 'check_reminders':
                    result = await this.executeReminderCheckJob(jobId);
                    break;
                case 'import_data':
                    result = { message: 'Import completed', imported: 0 };
                    break;
                default:
                    result = { message: 'Unknown job type' };
            }

            // Job als abgeschlossen markieren
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await this.jobsRepository.update(jobId, {
                status: 'completed',
                progress: 100,
                result,
                completedAt: new Date(),
            } as any);
        } catch (error) {
            // Job als fehlgeschlagen markieren
            await this.jobsRepository.update(jobId, {
                status: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error',
                completedAt: new Date(),
            });
        }
    }

    /**
     * A4:Job - Export aller Abonnements eines Benutzers
     */
    private async executeExportJob(
        userId: string,
        jobId: string,
    ): Promise<Record<string, unknown>> {
        await this.updateJobStatus(jobId, 'running', 30);

        const subscriptions = await this.subscriptionsRepository.find({
            where: { userId },
            relations: ['category'],
        });

        await this.updateJobStatus(jobId, 'running', 60);

        // Simuliere Export-Verarbeitung (in Produktion: echte CSV-Generierung)
        await this.simulateDelay(1000);

        await this.updateJobStatus(jobId, 'running', 90);

        // Erstelle Export-Daten
        const exportData = subscriptions.map((sub) => ({
            id: sub.id,
            name: sub.name,
            price: sub.price,
            billingCycle: sub.billingCycle,
            category: sub.category?.name || 'Unbekannt',
            nextBillingDate: sub.nextBillingDate,
            isActive: sub.isActive,
        }));

        return {
            exportedAt: new Date().toISOString(),
            totalSubscriptions: exportData.length,
            format: 'json',
            data: exportData,
        };
    }

    /**
     * A4:Job - Prüft auf fällige Erinnerungen
     */
    private async executeReminderCheckJob(jobId: string): Promise<Record<string, unknown>> {
        await this.updateJobStatus(jobId, 'running', 25);

        const today = new Date().toISOString().split('T')[0];
        const dueReminders = await this.remindersRepository.find({
            where: {
                reminderDate: LessThanOrEqual(today),
                isActive: true,
            },
            relations: ['subscription'],
        });

        await this.updateJobStatus(jobId, 'running', 50);

        // Simuliere Benachrichtigungsverarbeitung
        await this.simulateDelay(500);

        await this.updateJobStatus(jobId, 'running', 75);

        const notifications = dueReminders.map((reminder) => ({
            reminderId: reminder.id,
            subscriptionName: reminder.subscription?.name || 'Unbekannt',
            message: `${reminder.title} - ${reminder.description || ''}`,
            type: reminder.type,
            dueDate: reminder.reminderDate,
        }));

        return {
            checkedAt: new Date().toISOString(),
            dueRemindersCount: notifications.length,
            notifications,
        };
    }

    /**
     * Importiert Abonnements aus einer Liste (A4:Job - Import)
     */
    async executeImportJob(
        userId: string,
        subscriptions: Array<{
            name: string;
            price: number;
            billingCycle: string;
            categoryName: string;
        }>,
    ): Promise<Job> {
        const job = await this.createJob('import_data', userId);

        // Führe Import im Hintergrund aus
        this.performImport(job.id, userId, subscriptions);

        return job;
    }

    private async performImport(
        jobId: string,
        userId: string,
        subscriptions: Array<{
            name: string;
            price: number;
            billingCycle: string;
            categoryName: string;
        }>,
    ): Promise<void> {
        try {
            await this.updateJobStatus(jobId, 'running', 10);

            let imported = 0;
            const total = subscriptions.length;

            for (let i = 0; i < subscriptions.length; i++) {
                const sub = subscriptions[i];

                // Finde oder erstelle Kategorie
                let category = await this.categoriesRepository.findOne({
                    where: { name: sub.categoryName },
                });
                if (!category) {
                    category = await this.categoriesRepository.save(
                        this.categoriesRepository.create({ name: sub.categoryName }),
                    );
                }

                // Erstelle Subscription
                const nextBilling = new Date();
                nextBilling.setMonth(nextBilling.getMonth() + 1);

                await this.subscriptionsRepository.save(
                    this.subscriptionsRepository.create({
                        name: sub.name,
                        price: sub.price,
                        billingCycle: sub.billingCycle as 'monthly' | 'yearly' | 'weekly' | 'quarterly',
                        nextBillingDate: nextBilling.toISOString().split('T')[0],
                        userId,
                        categoryId: category.id,
                        isActive: true,
                    }),
                );

                imported++;
                await this.updateJobStatus(jobId, 'running', Math.round((i / total) * 80) + 10);
            }

            await this.jobsRepository.update(jobId, {
                status: 'completed',
                progress: 100,
                result: { imported, message: `${imported} Abonnements importiert` },
                completedAt: new Date(),
            });
        } catch (error) {
            await this.jobsRepository.update(jobId, {
                status: 'failed',
                error: error instanceof Error ? error.message : 'Import fehlgeschlagen',
                completedAt: new Date(),
            });
        }
    }

    private async updateJobStatus(
        jobId: string,
        status: JobStatus,
        progress: number,
    ): Promise<void> {
        await this.jobsRepository.update(jobId, { status, progress });
    }

    private async simulateDelay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
