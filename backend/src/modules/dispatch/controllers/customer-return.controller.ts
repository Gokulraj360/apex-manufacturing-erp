import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CustomerReturnService } from '../services/customer-return.service';
import {
  CreateCustomerReturnDto,
  UpdateReturnDispositionDto,
  LogTransitDamageDto,
} from '../dto/customer-return.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/dispatch/returns')
@UseGuards(RBACGuard)
export class CustomerReturnController {
  constructor(private readonly returnService: CustomerReturnService) {}

  @Get('rma')
  @RequirePermissions({ action: 'READ', resource: 'DISPATCH' })
  async getReturns() {
    return this.returnService.getReturns();
  }

  @Post('rma')
  @RequirePermissions({ action: 'WRITE', resource: 'DISPATCH' })
  async createReturn(@Body() dto: CreateCustomerReturnDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.returnService.createReturn(dto, userId);
  }

  @Put('rma/:id/disposition')
  @RequirePermissions({ action: 'WRITE', resource: 'DISPATCH' })
  async updateDisposition(
    @Param('id') id: string,
    @Body() dto: UpdateReturnDispositionDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.returnService.updateDisposition(id, dto, userId);
  }

  @Get('transit-damages')
  @RequirePermissions({ action: 'READ', resource: 'DISPATCH' })
  async getTransitDamages() {
    return this.returnService.getTransitDamages();
  }

  @Post('transit-damages')
  @RequirePermissions({ action: 'WRITE', resource: 'DISPATCH' })
  async logTransitDamage(@Body() dto: LogTransitDamageDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.returnService.logTransitDamage(dto, userId);
  }
}
