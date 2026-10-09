import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PackagingBarcodeService } from '../services/packaging-barcode.service';
import {
  CreatePackedCartonDto,
  GenerateBarcodeDto,
} from '../dto/packaging-barcode.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/dispatch/packaging')
@UseGuards(RBACGuard)
export class PackagingBarcodeController {
  constructor(private readonly packagingService: PackagingBarcodeService) {}

  @Get('cartons')
  @RequirePermissions({ action: 'READ', resource: 'DISPATCH' })
  async getCartons(@Query('orderRef') orderRef?: string) {
    return this.packagingService.getCartons(orderRef);
  }

  @Post('cartons')
  @RequirePermissions({ action: 'WRITE', resource: 'DISPATCH' })
  async createCarton(@Body() dto: CreatePackedCartonDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.packagingService.createCarton(dto, userId);
  }

  @Post('barcodes/generate')
  @RequirePermissions({ action: 'WRITE', resource: 'DISPATCH' })
  async generateBarcode(@Body() dto: GenerateBarcodeDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.packagingService.generateBarcode(dto, userId);
  }

  @Get('barcodes')
  @RequirePermissions({ action: 'READ', resource: 'DISPATCH' })
  async getBarcodes() {
    return this.packagingService.getBarcodes();
  }
}
