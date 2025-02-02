import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  Inject,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Enrollments } from 'src/database/entities/enrollment.entity';
import { Payments } from 'src/database/entities/payment.entity';
import Stripe from 'stripe';

@Controller('webhooks')
export class WebhookController {
  private stripe: Stripe;

  constructor(
    @Inject('PAYMENTS') private readonly paymentModel: typeof Payments,
    @Inject('ENROLLMENTS')
    private readonly enrollmentsModel: typeof Enrollments,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  @Post('stripe')
  @HttpCode(200)
  async handleStripeWebhook(
    @Body() body: any,
    @Req() request: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;
    try {
      console.log('Received webhook event.');
      event = this.stripe.webhooks.constructEvent(
        request.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return;
    }
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata.user_id;
      const subscriptionId = session.subscription;
      await this.saveSubscriptionId(subscriptionId, userId);
      await this.enrollmentsModel.update(
        {
          payed_for: true,
        },
        {
          where: {
            student_id: userId,
          },
        },
      );
    }
  }

  private async saveSubscriptionId(subscriptionId: any, userId: string) {
    await this.paymentModel.create({
      user_id: userId,
      activate: true,
      stripe_sub_id: subscriptionId,
    });
  }
}
