import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MaterialRequisitionService } from '../services/material-requisition.service';
import {
  CreateRequisitionDto,
  IssueRequisitionDto,
  UpdateWipStageDto,
} from '../dto/material-requisition.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/production/requisitions')
@UseGuards(RBACGuard)
export class MaterialRequisitionController {
  constructor(private readonly requisitionService: MaterialRequisitionService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getRequisitions() {
    return this.requisitionService.getRequisitions();
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createRequisition(@Body() dto: CreateRequisitionDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.requisitionService.createRequisition(dto, adminUserId);
  }

  @Post('issue')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async issueRequisition(@Body() dto: IssueRequisitionDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.requisitionService.issueRequisition(dto, adminUserId);
  }

  @Get('wip-inventory')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getWipInventory() {
    return this.requisitionService.getWipInventory();
  }

  @Post('wip-stage')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateWipStage(@Body() dto: UpdateWipStageDto) {
    return this.requisitionService.updateWipStage(dto);
  }
}
