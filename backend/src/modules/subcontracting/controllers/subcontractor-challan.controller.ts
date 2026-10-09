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
import { SubcontractorChallanService } from '../services/subcontractor-challan.service';
import {
  CreateSubcontractorChallanDto,
  UpdateChallanStatusDto,
  QueryChallanDto,
} from '../dto/subcontractor-challan.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/subcontracting/challans')
@UseGuards(RBACGuard)
export class SubcontractorChallanController {
  constructor(private readonly challanService: SubcontractorChallanService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getChallans(@Query() query: QueryChallanDto) {
    return this.challanService.getChallans(query);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createChallan(@Body() dto: CreateSubcontractorChallanDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.challanService.createChallan(dto, userId);
  }

  @Put(':id/status')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateChallanStatus(
    @Param('id') id: string,
    @Body() dto: UpdateChallanStatusDto,
  ) {
    return this.challanService.updateChallanStatus(id, dto);
  }
}
