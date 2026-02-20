/**
 * SubMate Backend - Main Entry Point
 * Initializes NestJS application with Swagger documentation
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for frontend
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Role', 'X-User-Id'],
    });

    // Global validation pipe for DTOs
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Swagger API documentation (Aufgabe 2 - A0)
    const config = new DocumentBuilder()
        .setTitle('SubMate API')
        .setDescription(
            'REST API für die SubMate Abo-Verwaltung. ' +
            'Alle Funktionalitäten sind über diese Swagger-Oberfläche testbar. ' +
            'Verwenden Sie den X-Role Header (user, premium, admin) für Rollensimulation.',
        )
        .setVersion('1.0')
        .addTag('users', 'Benutzerverwaltung (CRUD)')
        .addTag('subscriptions', 'Abonnement-Verwaltung (CRUD)')
        .addTag('reminders', 'Erinnerungs-Verwaltung (CRUD)')
        .addTag('categories', 'Kategorie-Verwaltung (CRUD)')
        .addTag('actions', 'Aktionen mit Daten (A2)')
        .addTag('jobs', 'Hintergrund-Operationen (A4)')
        .addApiKey({ type: 'apiKey', name: 'X-Role', in: 'header' }, 'X-Role')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
    console.log('🚀 SubMate Backend running on http://localhost:3000');
    console.log('📚 Swagger API Docs: http://localhost:3000/api');
}
bootstrap();
