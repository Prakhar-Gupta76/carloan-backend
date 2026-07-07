import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    trim: true,
  })
  name?: string;

  @Prop({
    required: true,
    trim: true,
    unique: true,
  })
  mobile_number: string;

  @Prop({
    trim: true,
  })
  pan?: string;

  @Prop({
    trim: true,
  })
  permanent_address?: string;

  @Prop()
  salary?: number;

  @Prop()
  age?: number;

  @Prop()
  current_company_duration?: number;

  @Prop()
  loan_amount?: number;

  @Prop()
  loan_tenure?: number;

  @Prop({
    type: MongooseSchema.Types.Mixed,
  })
  account_aggregator_response?: Record<string, unknown>;

  @Prop({
    type: MongooseSchema.Types.Mixed,
  })
  epfo_response?: Record<string, unknown>;

  @Prop({
    type: MongooseSchema.Types.Mixed,
  })
  credit_bureau_credit_score_response?: Record<string, unknown>;

  @Prop({
    type: MongooseSchema.Types.Mixed,
  })
  credit_bureau_existing_emis_response?: Record<string, unknown>;
}

export const UserSchema = SchemaFactory.createForClass(User);
