import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { QuotesModule } from './quotes/quotes.module';
import { UserModule } from './user/user.module';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? '', {}),
    AuthModule,
    UserModule,
    QuotesModule,
    VerificationModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
