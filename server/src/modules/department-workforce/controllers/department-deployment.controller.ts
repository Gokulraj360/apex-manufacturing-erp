import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { DepartmentDeploymentService } from '../services/department-deployment.service';
import {
  CreateWorkstationAssignmentDto,
  UpdateDeploymentStatusDto,
  QueryDeploymentsDto,
} from '../dto/department-deployment.dto';

@Controller('api/v1/department-workforce/deployments')
export class DepartmentDeploymentController {
  constructor(
    private readonly deploymentService: DepartmentDeploymentService,
  ) {}

  @Get()
  async getDeployments(@Query() query: QueryDeploymentsDto) {
    return this.deploymentService.getDeployments(query);
  }

  @Get(':id')
  async getDeploymentById(@Param('id') id: string) {
    return this.deploymentService.getDeploymentById(id);
  }

  @Post()
  async createDeployment(@Body() dto: CreateWorkstationAssignmentDto) {
    return this.deploymentService.createDeployment(dto);
  }

  @Patch(':id/status')
  async updateDeploymentStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDeploymentStatusDto,
  ) {
    return this.deploymentService.updateDeploymentStatus(id, dto);
  }
}
