/**
 * Actions DTOs - Data Transfer Objects für Aktionen (A2)
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsArray, IsOptional, IsInt, Min, Max } from 'class-validator';

export class ShareSubscriptionDto {
    @ApiProperty({
        example: ['user-id-1', 'user-id-2'],
        description: 'IDs der Benutzer, mit denen geteilt werden soll',
    })
    @IsArray()
    @IsUUID('4', { each: true })
    targetUserIds: string[];
}

export class CostAnalysisResponseDto {
    @ApiProperty({ example: 89.97, description: 'Gesamtkosten pro Monat' })
    totalMonthly: number;

    @ApiProperty({ example: 1079.64, description: 'Gesamtkosten pro Jahr' })
    totalYearly: number;

    @ApiProperty({ example: 29.99, description: 'Kosten pro Person pro Monat' })
    perPersonMonthly: number;

    @ApiProperty({ example: 359.88, description: 'Kosten pro Person pro Jahr' })
    perPersonYearly: number;

    @ApiProperty({ description: 'Kosten aufgeschlüsselt nach Kategorie' })
    byCategory: Record<string, number>;

    @ApiProperty({ description: 'Anstehende Zahlungen' })
    upcomingPayments: Array<{
        subscriptionId: string;
        subscriptionName: string;
        dueDate: string;
        amount: number;
    }>;
}

export class CancelRemindersDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Abonnement-ID',
    })
    @IsUUID()
    subscriptionId: string;
}

export class CancelRemindersResponseDto {
    @ApiProperty({ example: 3, description: 'Anzahl deaktivierter Erinnerungen' })
    cancelledCount: number;

    @ApiProperty({ example: 'Erfolgreich 3 Erinnerungen deaktiviert' })
    message: string;
}
