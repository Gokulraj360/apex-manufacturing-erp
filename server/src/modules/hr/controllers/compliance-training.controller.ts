import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ComplianceTrainingService } from '../services/compliance-training.service';
import {
  CreateSafetyTrainingDto,
  CreateLaborComplianceDocDto,
  UpdateComplianceStatusDto,
} from '../dto/compliance.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/hr/compliance')
@UseGuards(RBACGuard)
export class ComplianceTrainingController {
  constructor(private readonly complianceService: ComplianceTrainingService) {}

  @Get('index')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getComplianceIndex() {
    return this.complianceService.getComplianceIndex();
  }

  @Post('training')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async logSafetyTraining(@Body() dto: CreateSafetyTrainingDto) {
    return this.complianceService.logSafetyTraining(dto);
  }

  @Get('training')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getSafetyTrainingLogs(@Query('employeeId') employeeId?: string) {
    return this.complianceService.getSafetyTrainingLogs(employeeId);
  }

  @Post('documents')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async createLaborComplianceDoc(
    @Body() dto: CreateLaborComplianceDocDto,
    @Req() req: any,
  ) {
    const auditorId = req.user?.id;
    return this.complianceService.createLaborComplianceDoc(dto, auditorId);
  }

  @Put('documents/:id')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async updateComplianceStatus(
    @Param('id') id: string,
    @Body() dto: UpdateComplianceStatusDto,
    @Req() req: any,
  ) {
    const auditorId = req.user?.id;
    return this.complianceService.updateComplianceStatus(id, dto, auditorId);
  }

  @Get('documents')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getLaborComplianceDocuments(@Query('category') category?: string) {
    return this.complianceService.getLaborComplianceDocuments(category);
  }
}
