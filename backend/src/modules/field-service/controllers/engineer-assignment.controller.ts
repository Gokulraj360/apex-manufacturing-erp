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
import { EngineerAssignmentService } from '../services/engineer-assignment.service';
import {
  CreateFieldEngineerDto,
  UpdateEngineerLocationDto,
  AddServiceLogDto,
  QueryFieldEngineerDto,
} from '../dto/engineer-assignment.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/field-service/engineers')
@UseGuards(RBACGuard)
export class EngineerAssignmentController {
  constructor(private readonly engineerService: EngineerAssignmentService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getEngineers(@Query() query: QueryFieldEngineerDto) {
    return this.engineerService.getEngineers(query);
  }

  @Get(':id')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getEngineerById(@Param('id') id: string) {
    return this.engineerService.getEngineerById(id);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createEngineer(@Body() dto: CreateFieldEngineerDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.engineerService.createEngineer(dto, userId);
  }

  @Put(':id/location')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async updateLocation(
    @Param('id') id: string,
    @Body() dto: UpdateEngineerLocationDto,
  ) {
    return this.engineerService.updateLocation(id, dto);
  }

  @Post('logs')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async addServiceLog(@Body() dto: AddServiceLogDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.engineerService.addServiceLog(dto, userId);
  }
}
