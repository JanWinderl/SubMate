/**
 * Reminder Entity - Datenmodell für Erinnerungen
 * 
 * Eigenschaften:
 * - id: Eindeutige UUID für jede Erinnerung
 * - subscriptionId: Fremdschlüssel zum Abonnement
 * - reminderDate: Datum der Erinnerung
 * - type: Art der Erinnerung (cancellation, renewal, price_change)
 * - isActive: Ob die Erinnerung aktiv ist
 * - message: Benutzerdefinierte Nachricht
 * - createdAt: Erstellungszeitpunkt
 */
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';

export type ReminderType =
    | 'cancellation'
    | 'renewal'
    | 'price_change'
    | 'billing'
    | 'custom';

@Entity('reminders')
export class Reminder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    subscriptionId: string | null;

    @Column({ type: 'date' })
    reminderDate: string;

    @Column({ type: 'text', default: 'renewal' })
    type: ReminderType;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    // Relation: Reminder gehört zu einer Subscription
    @ManyToOne(() => Subscription, (subscription) => subscription.reminders, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'subscriptionId' })
    subscription: Subscription;
}
