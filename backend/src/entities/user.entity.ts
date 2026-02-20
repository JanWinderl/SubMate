/**
 * User Entity - Datenmodell für Benutzer
 * 
 * Eigenschaften:
 * - id: Eindeutige UUID für jeden Benutzer
 * - email: E-Mail-Adresse (eindeutig)
 * - name: Anzeigename des Benutzers
 * - role: Benutzerrolle (user, premium, admin)
 * - householdSize: Anzahl der Haushaltsmitglieder für Pro-Kopf-Berechnung
 * - createdAt: Erstellungszeitpunkt
 * - updatedAt: Letzter Änderungszeitpunkt
 */
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Subscription } from './subscription.entity';

export type UserRole = 'user' | 'premium' | 'admin';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ type: 'text', default: 'user' })
    role: UserRole;

    @Column({ default: 1 })
    householdSize: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relation: Ein User kann mehrere Subscriptions haben
    @OneToMany(() => Subscription, (subscription) => subscription.user)
    subscriptions: Subscription[];
}
