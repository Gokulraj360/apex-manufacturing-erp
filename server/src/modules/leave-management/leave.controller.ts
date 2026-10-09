import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import {
  CreateLeaveRequestDto,
  ReviewLeaveRequestDto,
  LeaveFilterDto,
} from './leave.dto';

@Controller('api/leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get('summary')
  async getLeaveSummary() {
    const summary = await this.leaveService.getLeaveSummaryMetrics();
    return {
      success: true,
      data: summary,
    };
  }

  @Get('balances/:employeeId')
  getBalances(@Param('employeeId') employeeId: string) {
    return {
      success: true,
      data: this.leaveService.getLeaveBalances(employeeId),
    };
  }

  @Get('pending/manager')
  async getPendingForManager(
    @Query('managerId') managerId?: string,
    @Query('department') department?: string,
  ) {
    const leaves = await this.leaveService.getPendingForManager(managerId, department);
    return {
      success: true,
      count: leaves.length,
      data: leaves,
    };
  }

  @Get('pending/hr')
  async getPendingForHr() {
    const leaves = await this.leaveService.getPendingForHr();
    return {
      success: true,
      count: leaves.length,
      data: leaves,
    };
  }

  @Get()
  async getLeaveRequests(@Query() query: LeaveFilterDto) {
    const leaves = await this.leaveService.getLeaveRequests(query);
    return {
      success: true,
      count: leaves.length,
      data: leaves,
    };
  }

  @Post()
  async createLeaveRequest(@Body() dto: CreateLeaveRequestDto) {
    const leave = await this.leaveService.createLeaveRequest(dto);
    return {
      success: true,
      message: `Leave request ${leave.leaveCode} submitted successfully and routed to ${leave.recipientType === 'DEPARTMENT_MANAGER' ? `Department Manager (${leave.targetApproverName})` : 'HR Department'}.`,
      data: leave,
    };
  }

  @Patch(':id/review')
  async reviewLeaveRequest(
    @Param('id') id: string,
    @Body() dto: ReviewLeaveRequestDto,
  ) {
    const updated = await this.leaveService.reviewLeaveRequest(id, dto);
    return {
      success: true,
      message: `Leave request ${updated.leaveCode} marked as ${updated.status}.`,
      data: updated,
    };
  }
}
