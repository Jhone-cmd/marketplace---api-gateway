import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProxyModule } from './proxy/proxy.module.js';
import { MiddlewareModule } from './middleware/middleware.module.js';
import { LoggingMiddleware } from './middleware/logging/logging.middleware.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          name: 'short',
          ttl: 1000, // 1 second
          limit: configService.get<number>('RATE_LIMIT_SHORT', 10), // 10 request per second
        },
        {
          name: 'medium',
          ttl: 60000, // 1 minute
          limit: configService.get<number>('RATE_LIMIT_MEDIUM', 100), // 100 request per minute
        },
        {
          name: 'long',
          ttl: 900000, // 15 minutes
          limit: configService.get<number>('RATE_LIMIT_LONG', 1000), // 1000 request per 15 minutes
        },
      ],
      inject: [ConfigService],
    }),
    ProxyModule,
    MiddlewareModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
