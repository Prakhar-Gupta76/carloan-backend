import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { GetQuotesDto } from './dto/get-quotes.dto';
import { QuotesService } from './quotes.service';

@Controller('api/v1')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post('getQuotes')
  getQuotes(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    getQuotesDto: GetQuotesDto,
  ) {
    return this.quotesService.getQuotes(getQuotesDto);
  }
}
