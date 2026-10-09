import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TaskDelegationService } from './task-delegation.service';
import {
  CreateTaskDelegationDto,
  UpdateTaskProgressDto,
  TaskFilterDto,
} from './task-delegation.dto';

@Controller('api/task-delegation')
export class TaskDelegationController {
  constructor(private readonly delegationService: TaskDelegationService) {}

  @Get('pairings')
  getDepartmentPairings() {
    return {
      success: true,
      data: this.delegationService.getDepartmentPairings(),
    };
  }

  @Get('global')
  async getGlobalSummary() {
    const summary = await this.delegationService.getGlobalSummary();
    return {
      success: true,
      data: summary,
    };
  }

  @Get()
  async getTasks(@Query() query: TaskFilterDto) {
    const tasks = await this.delegationService.getTasks(query);
    return {
      success: true,
      count: tasks.length,
      data: tasks,
    };
  }

  @Post()
  async createTask(@Body() dto: CreateTaskDelegationDto) {
    const task = await this.delegationService.createTask(dto);
    return {
      success: true,
      message: `Task ${task.taskCode} successfully delegated to ${task.assistantName}.`,
      data: task,
    };
  }

  @Patch(':id/progress')
  async updateProgress(
    @Param('id') id: string,
    @Body() dto: UpdateTaskProgressDto,
  ) {
    const updated = await this.delegationService.updateProgress(id, dto);
    return {
      success: true,
      message: `Task ${updated.taskCode} progress updated to ${updated.progressPercentage}%.`,
      data: updated,
    };
  }
}
