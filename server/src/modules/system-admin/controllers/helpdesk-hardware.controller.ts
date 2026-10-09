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
import { HelpdeskHardwareService } from '../services/helpdesk-hardware.service';
import {
  CreateSupportTicketDto,
  UpdateSupportTicketDto,
  ResolveSupportTicketDto,
} from '../dto/helpdesk-hardware.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { SupportTicketPriority, SupportTicketStatus } from '@prisma/client';

@Controller('api/v1/system-admin/helpdesk')
@UseGuards(RBACGuard)
export class HelpdeskHardwareController {
  constructor(private readonly helpdeskService: HelpdeskHardwareService) {}

  @Get('tickets')
  @RequirePermissions({ action: 'READ', resource: 'SYSTEM_ADMIN' })
  async getTickets(
    @Query('status') status?: SupportTicketStatus,
    @Query('priority') priority?: SupportTicketPriority,
    @Query('category') category?: string,
  ) {
    return this.helpdeskService.getSupportTickets({ status, priority, category });
  }

  @Get('metrics')
  @RequirePermissions({ action: 'READ', resource: 'SYSTEM_ADMIN' })
  async getMetrics() {
    return this.helpdeskService.getHelpdeskMetrics();
  }

  @Get('tickets/:id')
  @RequirePermissions({ action: 'READ', resource: 'SYSTEM_ADMIN' })
  async getTicketById(@Param('id') id: string) {
    return this.helpdeskService.getTicketById(id);
  }

  @Post('tickets')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async createTicket(@Body() dto: CreateSupportTicketDto) {
    return this.helpdeskService.createSupportTicket(dto);
  }

  @Put('tickets/:id')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async updateTicket(
    @Param('id') id: string,
    @Body() dto: UpdateSupportTicketDto,
  ) {
    return this.helpdeskService.updateSupportTicket(id, dto);
  }

  @Post('tickets/resolve')
  @RequirePermissions({ action: 'WRITE', resource: 'SYSTEM_ADMIN' })
  async resolveTicket(@Body() dto: ResolveSupportTicketDto, @Req() req: any) {
    const engineerId = req.user?.id;
    return this.helpdeskService.resolveSupportTicket(dto, engineerId);
  }
}
