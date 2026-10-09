import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MRPForecastService } from '../services/mrp-forecast.service';
import {
  CreateMRPPlanDto,
  RunMRPCalculationDto,
  UpdateMRPPlanStatusDto,
  QueryMRPPlanDto,
} from '../dto/mrp-forecast.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/supply-chain/mrp')
@UseGuards(RBACGuard)
export class MRPForecastController {
  constructor(private readonly mrpService: MRPForecastService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getPlans(@Query() query: QueryMRPPlanDto) {
    return this.mrpService.getPlans(query);
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getPlanById(@Param('id') id: string) {
    return this.mrpService.getPlanById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createPlan(@Body() dto: CreateMRPPlanDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.mrpService.createPlan(dto, userId);
  }

  @Post('calculate')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async calculateMRP(@Body() dto: RunMRPCalculationDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.mrpService.calculateMRP(dto, userId);
  }

  @Put(':id/status')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateMRPPlanStatusDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.mrpService.updateStatus(id, dto, userId);
  }

  @Delete(':id')
  @RequirePermissions({ action: 'ADMIN', resource: 'PRODUCTION' })
  async deletePlan(@Param('id') id: string) {
    return this.mrpService.deletePlan(id);
  }
}
