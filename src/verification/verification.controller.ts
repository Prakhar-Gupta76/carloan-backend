import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { VerificationService } from './verification.service';
import { VerifyDobDto } from './dto/verify-dob.dto';
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

  @Post('verifyDOB')
  @UseInterceptors(
    FileInterceptor('document_file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  verifyDOB(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    verifyDobDto: VerifyDobDto,
    @UploadedFile() documentFile?: Express.Multer.File,
  ) {
    return this.verificationService.verifyDOB(verifyDobDto, documentFile);
  }
}
