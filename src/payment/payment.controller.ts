import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { PayDto } from './dto/pay.dto';
import { PaymentService } from './payment.service';

@Controller('api/v1')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pay')
  pay(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    payDto: PayDto,
  ) {
    return this.paymentService.pay(payDto);
  }
}
