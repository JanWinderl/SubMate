/**
 * Subscription Entity - Datenmodell für Abonnements
 * 
 * Eigenschaften:
 * - id: Eindeutige UUID für jedes Abonnement
 * - name: Name des Abonnements (z.B. "Netflix", "Spotify")
 * - price: Preis pro Abrechnungszeitraum
 * - billingCycle: Abrechnungszeitraum (monthly, yearly, weekly, quarterly)
 * - nextBillingDate: Nächstes Abrechnungsdatum
 * - cancellationDeadline: Kündigungsfrist (optional)
 * - isActive: Ob das Abo aktiv ist
 * - notes: Zusätzliche Notizen (optional)
 * - sharedWith: JSON-Array von User-IDs, mit denen das Abo geteilt wird
 * - userId: Fremdschlüssel zum Besitzer
 * - categoryId: Fremdschlüssel zur Kategorie
 * - createdAt: Erstellungszeitpunkt
 * - updatedAt: Letzter Änderungszeitpunkt
 */
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Reminder } from './reminder.entity';

export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'quarterly';

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'text', default: 'monthly' })
    billingCycle: BillingCycle;

    @Column({ type: 'date' })
    nextBillingDate: string;

    @Column({ type: 'date', nullable: true })
    cancellationDeadline: string | null;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @Column({ type: 'text', default: '#8b5cf6' })
    color: string;

    @Column({ type: 'simple-json', nullable: true })
    sharedWith: string[] | null;

    @Column()
    userId: string;

    @Column()
    categoryId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relation: Subscription gehört zu einem User
    @ManyToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    // Relation: Subscription gehört zu einer Category
    @ManyToOne(() => Category, (category) => category.subscriptions)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    // Relation: Subscription kann mehrere Reminders haben
    @OneToMany(() => Reminder, (reminder) => reminder.subscription)
    reminders: Reminder[];
}
