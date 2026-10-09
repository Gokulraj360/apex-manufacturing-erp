import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReceivingService } from '../services/receiving.service';
import { CreateGrnDto } from '../dto/receiving.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/warehouse/receiving')
@UseGuards(RBACGuard)
export class ReceivingController {
  constructor(private readonly receivingService: ReceivingService) {}

  @Get('grns')
  @RequirePermissions({ action: 'READ', resource: 'INVENTORY' })
  async getGrns() {
    return this.receivingService.getGrns();
  }

  @Post('grns')
  @RequirePermissions({ action: 'WRITE', resource: 'INVENTORY' })
  async createGrn(@Body() dto: CreateGrnDto, @Req() req: any) {
    const inspectorUserId = req.user?.id;
    return this.receivingService.createGrn(dto, inspectorUserId);
  }
}
