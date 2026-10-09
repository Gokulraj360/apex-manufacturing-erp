import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CredentialService } from './credential.service';
import {
  CreateCredentialDto,
  UpdateCredentialDto,
  CalculateSalaryPreviewDto,
} from './dto/payroll-cred.dto';

@Controller('api/v1/payroll-cred/credentials')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Post('calculate-salary')
  @HttpCode(HttpStatus.OK)
  calculateSalaryPreview(@Body() dto: CalculateSalaryPreviewDto) {
    return this.credentialService.calculateSalaryBreakdown(dto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createCredential(@Body() dto: CreateCredentialDto) {
    return this.credentialService.createCredential(dto);
  }

  @Get()
  findAllCredentials(
    @Query('department') department?: string,
    @Query('role') role?: string,
    @Query('search') search?: string,
  ) {
    return this.credentialService.findAllCredentials({ department, role, search });
  }

  @Get(':id')
  findCredentialById(@Param('id') id: string) {
    return this.credentialService.findCredentialById(id);
  }

  @Put(':id')
  updateCredential(
    @Param('id') id: string,
    @Body() dto: UpdateCredentialDto,
  ) {
    return this.credentialService.updateCredential(id, dto);
  }
}
