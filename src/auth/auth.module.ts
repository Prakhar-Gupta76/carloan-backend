import { Module } from '@nestjs/common';
import { AxiosHelper } from '../common/helpers/axios.helper';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, AxiosHelper],
})
export class AuthModule {}
