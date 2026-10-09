import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { MachineStatus } from '@prisma/client';

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsOptional()
  @IsEnum(MachineStatus)
  status?: MachineStatus = MachineStatus.OPERATIONAL;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  capacityPerHour?: number = 0;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  hourlyRate?: number = 0;
}
