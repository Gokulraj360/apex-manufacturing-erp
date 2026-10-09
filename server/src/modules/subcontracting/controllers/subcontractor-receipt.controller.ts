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
import { SubcontractorReceiptService } from '../services/subcontractor-receipt.service';
import {
  CreateSubcontractorReceiptDto,
  InspectReceiptDto,
  ReconcileMaterialDto,
} from '../dto/subcontractor-receipt.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { SubcontractQualityStatus } from '@prisma/client';

@Controller('api/v1/subcontracting/receipts')
@UseGuards(RBACGuard)
export class SubcontractorReceiptController {
  constructor(private readonly receiptService: SubcontractorReceiptService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getReceipts(
    @Query('jobWorkOrderId') jobWorkOrderId?: string,
    @Query('challanId') challanId?: string,
    @Query('vendorId') vendorId?: string,
    @Query('qualityStatus') qualityStatus?: SubcontractQualityStatus,
  ) {
    return this.receiptService.getReceipts({
      jobWorkOrderId,
      challanId,
      vendorId,
      qualityStatus,
    });
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createReceipt(
    @Body() dto: CreateSubcontractorReceiptDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.receiptService.createReceipt(dto, userId);
  }

  @Put(':id/inspect')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async inspectReceipt(
    @Param('id') id: string,
    @Body() dto: InspectReceiptDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.receiptService.inspectReceipt(id, dto, userId);
  }

  @Post('reconcile')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async reconcileMaterial(
    @Body() dto: ReconcileMaterialDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.receiptService.reconcileMaterial(dto, userId);
  }
}
