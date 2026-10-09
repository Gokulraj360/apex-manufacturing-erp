import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CertificationValidationService } from '../services/certification-validation.service';
import {
  CreateMachineCertificationDto,
  ValidateOperatorCertificationDto,
  QueryCertificationsDto,
} from '../dto/certification-validation.dto';

@Controller('api/v1/department-workforce/certifications')
export class CertificationValidationController {
  constructor(
    private readonly certService: CertificationValidationService,
  ) {}

  @Get()
  async getCertifications(@Query() query: QueryCertificationsDto) {
    return this.certService.getCertifications(query);
  }

  @Get(':id')
  async getCertificationById(@Param('id') id: string) {
    return this.certService.getCertificationById(id);
  }

  @Post('validate')
  async validateOperatorCertification(
    @Body() dto: ValidateOperatorCertificationDto,
  ) {
    return this.certService.validateOperatorCertification(dto);
  }

  @Post()
  async createCertification(@Body() dto: CreateMachineCertificationDto) {
    return this.certService.createCertification(dto);
  }
}
