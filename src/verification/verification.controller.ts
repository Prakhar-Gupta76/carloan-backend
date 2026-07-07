import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerifyDetailsDto } from './dto/verify-details.dto';

@Controller('api/v1')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('verifyDetails')
  verifyDetails(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    verifyDetailsDto: VerifyDetailsDto,
  ) {
    return this.verificationService.verifyDetails(verifyDetailsDto);
  }
}
