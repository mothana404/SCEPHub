import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Enrollments } from 'src/database/entities/enrollment.entity';
import { Payments } from 'src/database/entities/payment.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  constructor(
    @Inject('PAYMENTS') private readonly paymentModel: typeof Payments,
    @Inject('ENROLLMENTS')
    private readonly enrollmentsModel: typeof Enrollments,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async getNumberOfCoursesFromUserList(userID: string) {
    try {
      const allEnrollments = await this.enrollmentsModel.findAll({
        where: {
          student_id: userID,
        },
      });
      const currentDate = new Date();
      for (const enrollment of allEnrollments) {
        const createdAt = new Date(enrollment.dataValues.createdAt);
        const diffInDays = Math.floor(
          (currentDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffInDays > 30 && enrollment.payed_for) {
          await this.enrollmentsModel.update(
            { payed_for: false },
            {
              where: {
                id: enrollment.id,
              },
            },
          );
        }
      }
      const unpaidCourses = await this.enrollmentsModel.findAll({
        where: {
          student_id: userID,
          payed_for: false,
        },
      });
      return unpaidCourses.length > 0 ? unpaidCourses.length : 0;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createCheckoutSession(userID: string, role: number) {
    try {
      let numberOfCourses = await this.getNumberOfCoursesFromUserList(userID);
      const subscriptionStatus = await this.getSubscriptionStatus(userID, role);
      if (numberOfCourses === 0 && subscriptionStatus.status === 'active') {
        return 'Your courses subscription is active';
      } else if (
        numberOfCourses === 0 &&
        subscriptionStatus.status != 'active'
      ) {
        numberOfCourses++;
      }
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: process.env.STRIPE_PRICE,
            quantity: numberOfCourses,
          },
        ],
        mode: 'subscription',
        metadata: {
          user_id: userID,
        },
        success_url: process.env.ALLOWED_ORIGIN,
        cancel_url: process.env.ALLOWED_ORIGIN,
      });
      return session.url;
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to create Checkout session: ${error.message}`);
    }
  }

  async getSubscriptionStatus(userID: string, role: number) {
    try {
      const studentStripeID = await this.paymentModel.findOne({
        where: {
          user_id: userID,
        },
      });
      if (studentStripeID === null) {
        return { status: 'not active' };
      }
      if (role !== 1) return { status: 'active' };
      const subscription = await this.stripe.subscriptions.retrieve(
        studentStripeID.stripe_sub_id,
      );
      return {
        status: subscription.status,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
      };
    } catch (error) {
      throw new Error(`Failed to retrieve subscription: ${error.message}`);
    }
  }
}
