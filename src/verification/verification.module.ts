import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AxiosHelper } from '../common/helpers/axios.helper';
import { User, UserSchema } from '../user/schemas/user.schema';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [VerificationController],
  providers: [VerificationService, AxiosHelper],
})
export class VerificationModule {}
