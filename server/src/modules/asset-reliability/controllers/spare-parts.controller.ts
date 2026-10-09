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
import { SparePartsService } from '../services/spare-parts.service';
import {
  CreateSparePartDto,
  UpdateSparePartDto,
  AdjustStockDto,
  CreateToolCribRequisitionDto,
  ApproveRequisitionDto,
  IssueRequisitionDto,
} from '../dto/spare-parts.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { ToolCribRequisitionStatus } from '@prisma/client';

@Controller('api/v1/asset-reliability/spare-parts')
@UseGuards(RBACGuard)
export class SparePartsController {
  constructor(private readonly sparePartsService: SparePartsService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getSpareParts(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('isLowStock') isLowStock?: string,
  ) {
    const lowStockBool = isLowStock === 'true';
    return this.sparePartsService.getSpareParts({ category, search, isLowStock: lowStockBool });
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createSparePart(@Body() dto: CreateSparePartDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.sparePartsService.createSparePart(dto, userId);
  }

  @Put(':id')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateSparePart(
    @Param('id') id: string,
    @Body() dto: UpdateSparePartDto,
  ) {
    return this.sparePartsService.updateSparePart(id, dto);
  }

  @Post(':id/adjust-stock')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async adjustStock(
    @Param('id') id: string,
    @Body() dto: AdjustStockDto,
  ) {
    return this.sparePartsService.adjustStock(id, dto);
  }

  @Get('requisitions/all')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getRequisitions(@Query('status') status?: ToolCribRequisitionStatus) {
    return this.sparePartsService.getRequisitions({ status });
  }

  @Post('requisitions')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createRequisition(@Body() dto: CreateToolCribRequisitionDto) {
    return this.sparePartsService.createRequisition(dto);
  }

  @Put('requisitions/:id/approve')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async approveRequisition(
    @Param('id') id: string,
    @Body() dto: ApproveRequisitionDto,
  ) {
    return this.sparePartsService.approveRequisition(id, dto);
  }

  @Post('requisitions/:id/issue')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async issueRequisition(
    @Param('id') id: string,
    @Body() dto: IssueRequisitionDto,
  ) {
    return this.sparePartsService.issueRequisition(id, dto);
  }
}
