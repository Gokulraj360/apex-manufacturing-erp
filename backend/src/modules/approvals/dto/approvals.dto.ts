import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class MfaSignoffDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'MFA OTP must be exactly 6 digits.' })
  otp: string;

  @IsString()
  @IsOptional()
  authorizedBy?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class QueryApprovalsDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
