import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, IsNumber, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { Role, UserRole } from '../../../common/enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole | Role;

  @IsOptional()
  @IsNumber()
  salary?: number; // CTC

  @IsOptional()
  @IsString()
  geoTag?: string; // GPS Coordinates / Plant Geofence

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  shiftCheckIn?: Date;

  @IsOptional()
  @IsString()
  mfaSecret?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole | Role;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsString()
  geoTag?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  shiftCheckIn?: Date;

  @IsOptional()
  @IsString()
  mfaSecret?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
