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
import { AssetRegistryService } from '../services/asset-registry.service';
import {
  CreateMachineAssetDto,
  UpdateMachineAssetDto,
  QueryMachineAssetDto,
} from '../dto/asset-registry.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/asset-reliability/registry')
@UseGuards(RBACGuard)
export class AssetRegistryController {
  constructor(private readonly registryService: AssetRegistryService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getMachineAssets(@Query() query: QueryMachineAssetDto) {
    return this.registryService.getMachineAssets(query);
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getMachineAssetById(@Param('id') id: string) {
    return this.registryService.getMachineAssetById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createMachineAsset(@Body() dto: CreateMachineAssetDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.registryService.createMachineAsset(dto, userId);
  }

  @Put(':id')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateMachineAsset(
    @Param('id') id: string,
    @Body() dto: UpdateMachineAssetDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.registryService.updateMachineAsset(id, dto, userId);
  }

  @Post(':id/decommission')
  @RequirePermissions({ action: 'ADMIN', resource: 'PRODUCTION' })
  async decommissionMachineAsset(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.registryService.decommissionMachineAsset(id, reason, userId);
  }
}
