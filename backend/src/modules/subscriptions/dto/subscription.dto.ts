/**
 * Subscription DTOs - Data Transfer Objects für Subscription API
 */
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsIn,
    IsNumber,
    IsBoolean,
    IsUUID,
    IsArray,
    IsDateString,
    Min,
} from 'class-validator';

export class CreateSubscriptionDto {
    @ApiProperty({ example: 'Netflix', description: 'Name des Abonnements' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 12.99, description: 'Preis pro Abrechnungszeitraum' })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({
        example: 'monthly',
        description: 'Abrechnungszeitraum',
        enum: ['monthly', 'yearly', 'weekly', 'quarterly'],
    })
    @IsIn(['monthly', 'yearly', 'weekly', 'quarterly'])
    billingCycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly';

    @ApiProperty({
        example: '2024-03-15',
        description: 'Nächstes Abrechnungsdatum (YYYY-MM-DD)',
    })
    @IsDateString()
    nextBillingDate: string;

    @ApiPropertyOptional({
        example: '2024-03-01',
        description: 'Kündigungsfrist (YYYY-MM-DD)',
    })
    @IsOptional()
    @IsDateString()
    cancellationDeadline?: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Kategorie-ID',
    })
    @IsUUID()
    categoryId: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Benutzer-ID',
    })
    @IsUUID()
    userId: string;

    @ApiPropertyOptional({ example: true, description: 'Ist das Abo aktiv?' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ example: 'Familien-Account', description: 'Notizen' })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional({ example: '#ff0000', description: 'Farbe (Hex)' })
    @IsOptional()
    @IsString()
    color?: string;

    @ApiPropertyOptional({
        example: ['user-id-1', 'user-id-2'],
        description: 'IDs der Benutzer, mit denen das Abo geteilt wird',
    })
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    sharedWith?: string[];
}

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) { }
