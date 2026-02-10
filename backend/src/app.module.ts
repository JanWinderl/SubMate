/**
 * SubMate Backend - Root Application Module
 * Configures TypeORM with SQLite and imports all feature modules
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ActionsModule } from './modules/actions/actions.module';
import { JobsModule } from './modules/jobs/jobs.module';

@Module({
    imports: [
        // TypeORM with SQLite configuration
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'submate.db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true, // Auto-create tables in development
            logging: true,
        }),
        // Feature modules
        UsersModule,
        SubscriptionsModule,
        RemindersModule,
        CategoriesModule,
        ActionsModule,
        JobsModule,
    ],
})
export class AppModule { }
