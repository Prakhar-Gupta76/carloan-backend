import { Module } from '@nestjs/common';
import { AxiosHelper } from '../common/helpers/axios.helper';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService, AxiosHelper],
})
export class QuotesModule {}
