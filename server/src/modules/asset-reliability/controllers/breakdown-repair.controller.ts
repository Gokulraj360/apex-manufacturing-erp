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
import { BreakdownRepairService } from '../services/breakdown-repair.service';
import {
  CreateBreakdownTicketDto,
  AssignTechnicianDto,
  UpdateBreakdownProgressDto,
  ResolveBreakdownTicketDto,
} from '../dto/breakdown-repair.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { BreakdownTicketStatus } from '@prisma/client';

@Controller('api/v1/asset-reliability/breakdowns')
@UseGuards(RBACGuard)
export class BreakdownRepairController {
  constructor(private readonly repairService: BreakdownRepairService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getBreakdownTickets(
    @Query('assetId') assetId?: string,
    @Query('status') status?: BreakdownTicketStatus,
    @Query('severity') severity?: any,
    @Query('technician') technician?: string,
  ) {
    return this.repairService.getBreakdownTickets({ assetId, status, severity, technician });
  }

  @Post('report')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async reportBreakdownTicket(
    @Body() dto: CreateBreakdownTicketDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.repairService.reportBreakdownTicket(dto, userId);
  }

  @Put(':id/assign')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async assignTechnician(
    @Param('id') id: string,
    @Body() dto: AssignTechnicianDto,
  ) {
    return this.repairService.assignTechnician(id, dto);
  }

  @Put(':id/progress')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateProgress(
    @Param('id') id: string,
    @Body() dto: UpdateBreakdownProgressDto,
  ) {
    return this.repairService.updateProgress(id, dto);
  }

  @Post(':id/resolve')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async resolveBreakdownTicket(
    @Param('id') id: string,
    @Body() dto: ResolveBreakdownTicketDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.repairService.resolveBreakdownTicket(id, dto, userId);
  }
}
