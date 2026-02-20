/**
 * Category DTOs - Data Transfer Objects für Category API
 */
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Streaming', description: 'Name der Kategorie' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        example: 'play-circle',
        description: 'Lucide Icon Name',
    })
    @IsOptional()
    @IsString()
    icon?: string;

    @ApiPropertyOptional({
        example: '#8b5cf6',
        description: 'Hex-Farbcode',
    })
    @IsOptional()
    @IsString()
    @Matches(/^#[0-9A-Fa-f]{6}$/, {
        message: 'color must be a valid hex color (e.g. #8b5cf6)',
    })
    color?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }
