/**
 * Category Entity - Datenmodell für Abo-Kategorien
 * 
 * Eigenschaften:
 * - id: Eindeutige UUID für jede Kategorie
 * - name: Name der Kategorie (z.B. "Streaming", "Fitness")
 * - icon: Lucide Icon-Name für die UI
 * - color: Hex-Farbcode für die visuelle Darstellung
 * - createdAt: Erstellungszeitpunkt
 */
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ default: 'folder' })
    icon: string;

    @Column({ default: '#6366f1' })
    color: string;

    @CreateDateColumn()
    createdAt: Date;

    // Relation: Eine Kategorie kann mehrere Subscriptions haben
    @OneToMany(() => Subscription, (subscription) => subscription.category)
    subscriptions: Subscription[];
}
