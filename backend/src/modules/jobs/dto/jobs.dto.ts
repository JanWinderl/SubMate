/**
 * Jobs DTOs - Data Transfer Objects für asynchrone Operationen (A4)
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsArray } from 'class-validator';

export class StartExportJobDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Benutzer-ID für den Export',
    })
    @IsUUID()
    userId: string;
}

export class StartImportJobDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Benutzer-ID für den Import',
    })
    @IsUUID()
    userId: string;

    @ApiProperty({
        description: 'Liste der zu importierenden Abonnements',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                price: { type: 'number' },
                billingCycle: { type: 'string' },
                categoryName: { type: 'string' },
            },
        },
    })
    @IsArray()
    subscriptions: Array<{
        name: string;
        price: number;
        billingCycle: string;
        categoryName: string;
    }>;
}

export class JobCreatedResponseDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Job-ID zur Statusabfrage',
    })
    jobId: string;

    @ApiProperty({
        example: 'Job wurde erstellt und wird im Hintergrund ausgeführt',
    })
    message: string;

    @ApiProperty({
        example: '/jobs/123e4567-e89b-12d3-a456-426614174000/status',
        description: 'URL zur Statusabfrage',
    })
    statusUrl: string;
}

export class JobStatusResponseDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ example: 'export_subscriptions' })
    type: string;

    @ApiProperty({
        example: 'completed',
        enum: ['pending', 'running', 'completed', 'failed'],
    })
    status: string;

    @ApiProperty({ example: 100 })
    progress: number;

    @ApiPropertyOptional({ description: 'Ergebnis des Jobs (nur bei completed)' })
    result?: Record<string, unknown>;

    @ApiPropertyOptional({ description: 'Fehlermeldung (nur bei failed)' })
    error?: string;

    @ApiProperty({ example: '2024-03-15T10:30:00Z' })
    createdAt: string;

    @ApiPropertyOptional({ example: '2024-03-15T10:30:05Z' })
    completedAt?: string;
}
