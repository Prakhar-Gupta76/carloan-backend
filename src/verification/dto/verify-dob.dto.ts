import { IsEnum, IsString, Matches } from 'class-validator';
import { IdentityProofType } from '../constants/verification.constants';

export class VerifyDobDto {
  @IsString()
  @Matches(/^\d{10}$/, {
    message: 'mobile_number must be a 10 digit number',
  })
  mobile_number: string;

  @IsEnum(IdentityProofType, {
    message: 'document_type must be AADHAR_CARD, PAN_CARD or VOTER_ID_CARD',
  })
  document_type: IdentityProofType;
}
