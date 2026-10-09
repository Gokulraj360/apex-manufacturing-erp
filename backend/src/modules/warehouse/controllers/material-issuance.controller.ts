import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MaterialIssuanceService } from '../services/material-issuance.service';
import { IssueMaterialsToProductionDto } from '../dto/material-issuance.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/warehouse/issuance')
@UseGuards(RBACGuard)
export class MaterialIssuanceController {
  constructor(private readonly issuanceService: MaterialIssuanceService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'INVENTORY' })
  async getIssuances() {
    return this.issuanceService.getIssuances();
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'INVENTORY' })
  async issueMaterials(@Body() dto: IssueMaterialsToProductionDto, @Req() req: any) {
    const user = req.user?.id;
    return this.issuanceService.issueMaterials(dto, user);
  }
}
