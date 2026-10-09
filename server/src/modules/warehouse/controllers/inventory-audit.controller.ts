import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InventoryAuditService } from '../services/inventory-audit.service';
import { SubmitCycleCountDto, LogDamagedItemDto } from '../dto/inventory-audit.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/warehouse/audits')
@UseGuards(RBACGuard)
export class InventoryAuditController {
  constructor(private readonly auditService: InventoryAuditService) {}

  @Get('cycle-counts')
  @RequirePermissions({ action: 'READ', resource: 'INVENTORY' })
  async getCycleCounts() {
    return this.auditService.getCycleCounts();
  }

  @Post('cycle-counts')
  @RequirePermissions({ action: 'WRITE', resource: 'INVENTORY' })
  async submitCycleCount(@Body() dto: SubmitCycleCountDto, @Req() req: any) {
    const user = req.user?.id;
    return this.auditService.submitCycleCount(dto, user);
  }

  @Put('cycle-counts/:countNumber/reconcile')
  @RequirePermissions({ action: 'WRITE', resource: 'INVENTORY' })
  async reconcileCycleCount(
    @Param('countNumber') countNumber: string,
    @Req() req: any,
  ) {
    const user = req.user?.id;
    return this.auditService.reconcileCycleCount(countNumber, user);
  }

  @Get('damaged-items')
  @RequirePermissions({ action: 'READ', resource: 'INVENTORY' })
  async getDamagedLogs() {
    return this.auditService.getDamagedLogs();
  }

  @Post('damaged-items')
  @RequirePermissions({ action: 'WRITE', resource: 'INVENTORY' })
  async logDamagedItem(@Body() dto: LogDamagedItemDto, @Req() req: any) {
    const user = req.user?.id;
    return this.auditService.logDamagedItem(dto, user);
  }
}
