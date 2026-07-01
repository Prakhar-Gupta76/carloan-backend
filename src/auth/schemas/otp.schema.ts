import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({
  timestamps: true,
})
export class Otp {
  @Prop({
    required: true,
    trim: true,
  })
  mobile_number: string;

  @Prop({
    required: true,
  })
  otp: number;

  @Prop({
    required: true,
  })
  created_at: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
