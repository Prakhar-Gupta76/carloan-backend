import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AxiosHelper } from '../common/helpers/axios.helper';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Otp, OtpSchema } from './schemas/otp.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  controllers: [AuthController],
  providers: [AuthService, AxiosHelper],
})
export class AuthModule {}
