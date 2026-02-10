/**
 * Job Entity - Datenmodell für Hintergrund-Jobs
 * 
 * Eigenschaften:
 * - id: Eindeutige UUID für jeden Job
 * - type: Art des Jobs (export, reminder_check, etc.)
 * - status: Aktueller Status (pending, running, completed, failed)
 * - progress: Fortschritt in Prozent
 * - result: JSON-Ergebnis des Jobs (null während Ausführung)
 * - error: Fehlermeldung falls fehlgeschlagen
 * - userId: Benutzer, der den Job gestartet hat
 * - createdAt: Erstellungszeitpunkt
 * - completedAt: Abschlusszeitpunkt (optional)
 */
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

export type JobType = 'export_subscriptions' | 'check_reminders' | 'import_data';
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

@Entity('jobs')
export class Job {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    type: JobType;

    @Column({ type: 'text', default: 'pending' })
    status: JobStatus;

    @Column({ default: 0 })
    progress: number;

    @Column({ type: 'simple-json', nullable: true })
    result: Record<string, unknown> | null;

    @Column({ type: 'text', nullable: true })
    error: string | null;

    @Column()
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'datetime', nullable: true })
    completedAt: Date | null;
}
