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
import { DefectTrackingService } from '../services/defect-tracking.service';
import {
  CreateDefectLogDto,
  UpdateDefectResolutionDto,
} from '../dto/defect-tracking.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { DefectCategory, DefectSeverity } from '@prisma/client';

@Controller('api/v1/quality/defects')
@UseGuards(RBACGuard)
export class DefectTrackingController {
  constructor(private readonly defectService: DefectTrackingService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getDefects(
    @Query('stage') stage?: string,
    @Query('category') category?: DefectCategory,
    @Query('severity') severity?: DefectSeverity,
  ) {
    return this.defectService.getDefectLogs(stage, category, severity);
  }

  @Get('metrics')
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getDefectMetrics() {
    return this.defectService.getDefectMetrics();
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getDefectById(@Param('id') id: string) {
    return this.defectService.getDefectById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'QUALITY' })
  async createDefect(@Body() dto: CreateDefectLogDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.defectService.createDefectLog(dto, userId);
  }

  @Put(':id/resolution')
  @RequirePermissions({ action: 'WRITE', resource: 'QUALITY' })
  async updateResolution(
    @Param('id') id: string,
    @Body() dto: UpdateDefectResolutionDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.defectService.updateDefectResolution(id, dto, userId);
  }
}
