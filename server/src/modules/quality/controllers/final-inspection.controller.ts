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
import { FinalInspectionService } from '../services/final-inspection.service';
import {
  CreateFinalInspectionDto,
  ApproveDispatchDto,
} from '../dto/final-inspection.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { QCStatus } from '@prisma/client';

@Controller('api/v1/quality/final')
@UseGuards(RBACGuard)
export class FinalInspectionController {
  constructor(private readonly finalService: FinalInspectionService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getInspections(
    @Query('approved') approved?: string,
    @Query('status') status?: QCStatus,
  ) {
    const isApproved = approved !== undefined ? approved === 'true' : undefined;
    return this.finalService.getInspections(isApproved, status);
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'QUALITY' })
  async getInspectionById(@Param('id') id: string) {
    return this.finalService.getInspectionById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'QUALITY' })
  async createInspection(@Body() dto: CreateFinalInspectionDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.finalService.createInspection(dto, userId);
  }

  @Put(':id/approve-dispatch')
  @RequirePermissions({ action: 'WRITE', resource: 'QUALITY' })
  async approveForDispatch(
    @Param('id') id: string,
    @Body() dto: ApproveDispatchDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.finalService.approveForDispatch(id, dto, userId);
  }

  @Put(':id/reject')
  @RequirePermissions({ action: 'WRITE', resource: 'QUALITY' })
  async rejectFromDispatch(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.finalService.rejectFromDispatch(id, reason, userId);
  }
}
