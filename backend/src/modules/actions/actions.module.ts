import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../../entities/subscription.entity';
import { User } from '../../entities/user.entity';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { RemindersModule } from '../reminders/reminders.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Subscription, User]),
        RemindersModule,
        SubscriptionsModule,
    ],
    controllers: [ActionsController],
    providers: [ActionsService],
})
export class ActionsModule { }
