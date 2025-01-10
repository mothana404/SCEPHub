import { DynamicModule, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { DatabaseModule } from 'src/database/database.module';
import { modelsProviders } from 'src/providers/models.providers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentController, WebhookController],
  providers: [PaymentService, ...modelsProviders],
})
export class PaymentModule {
  static forRootAsync(): DynamicModule {
    return {
      module: PaymentModule,
      controllers: [PaymentController],
      imports: [ConfigModule.forRoot()],
      providers: [
        PaymentModule,
        {
          provide: process.env.STRIPE_PRICE,
          useFactory: async (configService: ConfigService) =>
            configService.get('STRIPE_API_KEY'),
          inject: [ConfigService],
        },
      ],
    };
  }
}
