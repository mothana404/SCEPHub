import { Controller, Get, UseGuards, Req, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/role/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role/role.enum';
import { Request } from 'express';

@ApiTags('Payment API')
@Controller('')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiResponse({
    status: 200,
    description: 'This will return a subscription page url',
  })
  @ApiResponse({
    status: 500,
    description: 'The server did not get the tokens',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Post('create-checkout-session')
  async createCheckoutSession(@Req() request: Request) {
    try {
      const userID = request['user'].user_id;
      const role = request['user'].role;
      const sessionUrl = await this.paymentService.createCheckoutSession(
        userID,
        role,
      );
      return { url: sessionUrl };
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }

  @ApiResponse({ status: 200, description: 'Returns the status' })
  @ApiResponse({ status: 404, description: 'There is no subscription found!' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('subscription-status')
  async getSubscriptionStatus(@Req() request: Request) {
    try {
      const userID = request['user'].user_id;
      const role = request['user'].role;
      const subscriptionStatus =
        await this.paymentService.getSubscriptionStatus(userID, role);
      return subscriptionStatus;
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }
}
