import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QualityService } from './quality.service';
import {
  CreateInwardInspectionDto,
  CreateFinalQCInspectionDto,
  QueryInspectionDto,
} from './dto/quality.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller(['quality', 'api/quality', 'qc', 'api/qc'])
export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

  @Get('inward/kpi')
  async getInwardQCSummary() {
    return this.qualityService.getInwardQCSummary();
  }

  @Get('inward')
  async findAllInward(@Query() query: QueryInspectionDto) {
    return this.qualityService.findAllInwardInspections(query);
  }

  @Get('inward/:id')
  async findOneInward(@Param('id') id: string) {
    return this.qualityService.findOneInwardInspection(id);
  }

  @Post('inward')
  @HttpCode(HttpStatus.CREATED)
  async createInward(@Body() dto: CreateInwardInspectionDto) {
    return this.qualityService.createInwardInspection(dto);
  }

  @Post('inward/reject-lot')
  @HttpCode(HttpStatus.CREATED)
  async rejectLotAndTriggerDebitNote(@Body() dto: any) {
    return this.qualityService.rejectLotAndTriggerDebitNote(dto);
  }

  @Post('inward/release-pass')
  @HttpCode(HttpStatus.OK)
  async releasePassBatch(@Body() dto: any) {
    return this.qualityService.releasePassBatch(dto);
  }

  @Get('final')
  async findAllFinal() {
    return this.qualityService.findAllFinalInspections();
  }

  @Post('final')
  @HttpCode(HttpStatus.CREATED)
  async createFinal(@Body() dto: CreateFinalQCInspectionDto) {
    return this.qualityService.createFinalInspection(dto);
  }
}
