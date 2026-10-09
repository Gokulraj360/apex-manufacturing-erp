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
import { InProcessInspectionService } from '../services/in-process-inspection.service';
import {
  CreateInProcessInspectionDto,
  UpdateInProcessInspectionDto,
} from '../dto/in-process-inspection.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { QCStatus } from '@prisma/client';

@Controller('api/v1/quality/in-process')
@UseGuards(RBACGuard)
export class InProcessInspectionController {
  constructor(private readonly inProcessService: InProcessInspectionService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getInspections(
    @Query('lineId') lineId?: string,
    @Query('status') status?: QCStatus,
  ) {
    return this.inProcessService.getInspections(lineId, status);
  }

  @Get('metrics')
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getLineMetrics() {
    return this.inProcessService.getLineQualityMetrics();
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getInspectionById(@Param('id') id: string) {
    return this.inProcessService.getInspectionById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'QUALITY' })
  async createInspection(@Body() dto: CreateInProcessInspectionDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.inProcessService.createInspection(dto, userId);
  }

  @Put(':id')
  @RequirePermissions({ action: 'WRITE', resource: 'QUALITY' })
  async updateInspection(
    @Param('id') id: string,
    @Body() dto: UpdateInProcessInspectionDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.inProcessService.updateInspection(id, dto, userId);
  }
}
