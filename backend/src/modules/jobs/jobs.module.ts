import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../../entities/job.entity';
import { Subscription } from '../../entities/subscription.entity';
import { Reminder } from '../../entities/reminder.entity';
import { Category } from '../../entities/category.entity';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Job, Subscription, Reminder, Category])],
    controllers: [JobsController],
    providers: [JobsService],
})
export class JobsModule { }
