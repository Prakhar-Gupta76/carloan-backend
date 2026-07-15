import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { RESPONSE_MESSAGES } from '../common/constants/response.constants';
import { ApiResponseHelper } from '../common/helpers/api-response.helper';
import { User } from '../user/schemas/user.schema';
import { PayDto } from './dto/pay.dto';

@Injectable()
export class PaymentService {
  private stripeClient: Stripe | null = null;

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

  async pay(payDto: PayDto) {
    const user = await this.userModel
      .findOne({ mobile_number: payDto.mobile_number })
      .exec();

    if (!user) {
      throw new BadRequestException(
        ApiResponseHelper.error(RESPONSE_MESSAGES.USER_DETAILS_NOT_FOUND),
      );
    }

    if (!user.loan_monthly_emi || user.loan_monthly_emi <= 0) {
      throw new BadRequestException(
        ApiResponseHelper.error(RESPONSE_MESSAGES.LOAN_MONTHLY_EMI_NOT_FOUND),
      );
    }

    const session = await this.getStripeClient().checkout.sessions.create({
      cancel_url: `${this.getFrontendUrl()}/review-details-pay`,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'First month EMI payment',
            },
            unit_amount: Math.round(user.loan_monthly_emi * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        mobile_number: user.mobile_number,
      },
      mode: 'payment',
      success_url: `${this.getFrontendUrl()}/thank-you`,
    });

    return ApiResponseHelper.ok(RESPONSE_MESSAGES.PAYMENT_SESSION_CREATED, [
      {
        sessionId: session.id,
        sessionUrl: session.url,
      },
    ]);
  }

  private getStripeClient() {
    if (this.stripeClient) {
      return this.stripeClient;
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      throw new InternalServerErrorException(
        'STRIPE_SECRET_KEY is not configured',
      );
    }

    this.stripeClient = new Stripe(stripeSecretKey);

    return this.stripeClient;
  }

  private getFrontendUrl() {
    return (process.env.FRONTEND_URL || "http://localhost:3000/").replace(
      /\/$/,
      '',
    );
  }
}
