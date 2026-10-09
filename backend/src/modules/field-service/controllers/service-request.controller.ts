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
import { ServiceRequestService } from '../services/service-request.service';
import {
  CreateServiceRequestDto,
  AssignEngineerDto,
  UpdateServiceRequestStatusDto,
  QueryServiceRequestDto,
} from '../dto/service-request.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/field-service/requests')
@UseGuards(RBACGuard)
export class ServiceRequestController {
  constructor(private readonly serviceRequestService: ServiceRequestService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getRequests(@Query() query: QueryServiceRequestDto) {
    return this.serviceRequestService.getRequests(query);
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getRequestById(@Param('id') id: string) {
    return this.serviceRequestService.getRequestById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createRequest(@Body() dto: CreateServiceRequestDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.serviceRequestService.createRequest(dto, userId);
  }

  @Put(':id/assign')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async assignEngineer(
    @Param('id') id: string,
    @Body() dto: AssignEngineerDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.serviceRequestService.assignEngineer(id, dto, userId);
  }

  @Put(':id/status')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestStatusDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.serviceRequestService.updateStatus(id, dto, userId);
  }
}
