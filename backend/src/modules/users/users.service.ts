/**
 * Users Service - Geschäftslogik für Benutzerverwaltung
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            relations: ['subscriptions'],
        });
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['subscriptions'],
        });
        if (!user) {
            throw new NotFoundException(`Benutzer mit ID ${id} nicht gefunden`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        // Prüfe ob E-Mail bereits existiert
        const existing = await this.findByEmail(createUserDto.email);
        if (existing) {
            throw new ConflictException(`E-Mail ${createUserDto.email} ist bereits registriert`);
        }

        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        // Prüfe ob neue E-Mail bereits existiert
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existing = await this.findByEmail(updateUserDto.email);
            if (existing) {
                throw new ConflictException(`E-Mail ${updateUserDto.email} ist bereits registriert`);
            }
        }

        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }
}
