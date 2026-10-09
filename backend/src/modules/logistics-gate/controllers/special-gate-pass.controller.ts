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
import { SpecialGatePassService } from '../services/special-gate-pass.service';
import {
  CreateSpecialGatePassDto,
  VerifySpecialGatePassReturnDto,
} from '../dto/special-gate-pass.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { GatePassType } from '@prisma/client';

@Controller('api/v1/logistics-gate/special-passes')
@UseGuards(RBACGuard)
export class SpecialGatePassController {
  constructor(private readonly passService: SpecialGatePassService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'LOGISTICS' })
  async getPasses(
    @Query('type') type?: GatePassType,
    @Query('isReturned') isReturned?: string,
  ) {
    const returned = isReturned !== undefined ? isReturned === 'true' : undefined;
    return this.passService.getPasses(type, returned);
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'LOGISTICS' })
  async getPassById(@Param('id') id: string) {
    return this.passService.getPassById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'LOGISTICS' })
  async createPass(@Body() dto: CreateSpecialGatePassDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.passService.createPass(dto, userId);
  }

  @Put(':id/verify-return')
  @RequirePermissions({ action: 'WRITE', resource: 'LOGISTICS' })
  async verifyReturn(
    @Param('id') id: string,
    @Body() dto: VerifySpecialGatePassReturnDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.passService.verifyReturn(id, dto, userId);
  }
}
