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
import { IncomingInspectionService } from '../services/incoming-inspection.service';
import {
  CreateIncomingInspectionDto,
  UpdateIncomingInspectionStatusDto,
} from '../dto/incoming-inspection.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { QCStatus } from '@prisma/client';

@Controller('api/v1/quality/incoming')
@UseGuards(RBACGuard)
export class IncomingInspectionController {
  constructor(private readonly incomingService: IncomingInspectionService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getInspections(@Query('status') status?: QCStatus) {
    return this.incomingService.getInspections(status);
  }

  @Get('pending')
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getPendingClearances() {
    return this.incomingService.getPendingClearances();
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getInspectionById(@Param('id') id: string) {
    return this.incomingService.getInspectionById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'QUALITY' })
  async createInspection(@Body() dto: CreateIncomingInspectionDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.incomingService.createInspection(dto, userId);
  }

  @Put(':id/status')
  @RequirePermissions({ action: 'WRITE', resource: 'QUALITY' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateIncomingInspectionStatusDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.incomingService.updateInspectionStatus(id, dto, userId);
  }
}
