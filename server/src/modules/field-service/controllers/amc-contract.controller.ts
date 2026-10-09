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
import { AMCContractService } from '../services/amc-contract.service';
import {
  CreateAMCContractDto,
  UpdateAMCContractDto,
  CreateWarrantyRecordDto,
  QueryAMCDto,
} from '../dto/amc-contract.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/field-service/amc')
@UseGuards(RBACGuard)
export class AMCContractController {
  constructor(private readonly amcService: AMCContractService) {}

  @Get('contracts')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getContracts(@Query() query: QueryAMCDto) {
    return this.amcService.getContracts(query);
  }

  @Get('contracts/:id')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getContractById(@Param('id') id: string) {
    return this.amcService.getContractById(id);
  }

  @Post('contracts')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createContract(@Body() dto: CreateAMCContractDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.amcService.createContract(dto, userId);
  }

  @Put('contracts/:id')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateContract(
    @Param('id') id: string,
    @Body() dto: UpdateAMCContractDto,
  ) {
    return this.amcService.updateContract(id, dto);
  }

  @Get('warranties')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getWarranties(@Query('search') search?: string) {
    return this.amcService.getWarranties(search);
  }

  @Post('warranties')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createWarranty(@Body() dto: CreateWarrantyRecordDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.amcService.createWarranty(dto, userId);
  }
}
