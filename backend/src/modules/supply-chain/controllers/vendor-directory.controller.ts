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
import { VendorDirectoryService } from '../services/vendor-directory.service';
import {
  CreateVendorDirectoryDto,
  UpdateVendorDirectoryDto,
  EvaluateVendorPerformanceDto,
  QueryVendorDirectoryDto,
} from '../dto/vendor-directory.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/supply-chain/vendors')
@UseGuards(RBACGuard)
export class VendorDirectoryController {
  constructor(private readonly vendorService: VendorDirectoryService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getVendors(@Query() query: QueryVendorDirectoryDto) {
    return this.vendorService.getVendors(query);
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getVendorById(@Param('id') id: string) {
    return this.vendorService.getVendorById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createVendor(@Body() dto: CreateVendorDirectoryDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.vendorService.createVendor(dto, userId);
  }

  @Put(':id')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateVendor(
    @Param('id') id: string,
    @Body() dto: UpdateVendorDirectoryDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.vendorService.updateVendor(id, dto, userId);
  }

  @Post(':id/evaluate')
  @RequirePermissions({ action: 'ADMIN', resource: 'PRODUCTION' })
  async evaluateVendor(
    @Param('id') id: string,
    @Body() dto: EvaluateVendorPerformanceDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.vendorService.evaluateVendor(id, dto, userId);
  }
}
