/**
 * Reminder DTOs - Data Transfer Objects für Reminder API
 */
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsIn,
    IsBoolean,
    IsUUID,
    IsDateString,
} from 'class-validator';

export class CreateReminderDto {
    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Subscription-ID (optional für allgemeine Erinnerungen)',
    })
    @IsOptional()
    @IsUUID()
    subscriptionId?: string;

    @ApiProperty({
        example: '2024-03-01',
        description: 'Erinnerungsdatum (YYYY-MM-DD)',
    })
    @IsDateString()
    reminderDate: string;

    @ApiProperty({
        example: 'cancellation',
        description: 'Art der Erinnerung',
        enum: ['cancellation', 'renewal', 'price_change', 'billing', 'custom'],
    })
    @IsIn(['cancellation', 'renewal', 'price_change', 'billing', 'custom'])
    type: 'cancellation' | 'renewal' | 'price_change' | 'billing' | 'custom';

    @ApiProperty({
        example: 'Netflix Verlängerung',
        description: 'Titel der Erinnerung',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({
        example: 'Abo verlängert sich bald (12.99€)',
        description: 'Beschreibung',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Ist die Erinnerung aktiv?',
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateReminderDto extends PartialType(CreateReminderDto) { }
