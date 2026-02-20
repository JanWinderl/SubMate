/**
 * User DTOs - Data Transfer Objects für User API
 */
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    IsNotEmpty,
    IsOptional,
    IsIn,
    IsInt,
    Min,
    Max,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'max@example.com', description: 'E-Mail-Adresse' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'Max Mustermann', description: 'Anzeigename' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        example: 'user',
        description: 'Benutzerrolle',
        enum: ['user', 'premium', 'admin'],
    })
    @IsOptional()
    @IsIn(['user', 'premium', 'admin'])
    role?: 'user' | 'premium' | 'admin';

    @ApiPropertyOptional({
        example: 2,
        description: 'Anzahl der Haushaltsmitglieder',
        minimum: 1,
        maximum: 20,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(20)
    householdSize?: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) { }
