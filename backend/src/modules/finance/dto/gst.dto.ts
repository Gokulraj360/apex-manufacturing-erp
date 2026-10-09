import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsOptional,
} from 'class-validator';

export class PostGstr1Dto {
  @IsString()
  @IsNotEmpty()
  filingMonth: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'Authenticator OTP must be exactly 6 numeric digits' })
  @Matches(/^[0-9]{6}$/, { message: 'Authenticator OTP must contain only numeric digits' })
  otp: string;

  @IsString()
  @IsOptional()
  authorizedSignatory?: string;
}

export class QueryGstDto {
  @IsString()
  @IsOptional()
  month?: string;
}
