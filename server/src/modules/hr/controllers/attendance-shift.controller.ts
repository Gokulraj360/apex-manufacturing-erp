import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AttendanceShiftService } from '../services/attendance-shift.service';
import {
  ClockInOutDto,
  RegularizeAttendanceDto,
  AssignShiftRosterDto,
  ApplyLeaveDto,
  ReviewLeaveDto,
  LogOvertimeDto,
  ApproveOvertimeDto,
} from '../dto/attendance-shift.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { AttendanceStatus } from '@prisma/client';

@Controller('api/v1/hr/attendance-shifts')
@UseGuards(RBACGuard)
export class AttendanceShiftController {
  constructor(private readonly attendanceService: AttendanceShiftService) {}

  @Post('clock')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async recordClockInOut(@Body() dto: ClockInOutDto) {
    return this.attendanceService.recordClockInOut(dto);
  }

  @Get('logs')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getAttendanceLogs(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('departmentId') departmentId?: string,
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: AttendanceStatus,
  ) {
    return this.attendanceService.getAttendanceLogs({
      startDate,
      endDate,
      departmentId,
      employeeId,
      status,
    });
  }

  @Put('regularize')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async regularizeAttendance(
    @Body() dto: RegularizeAttendanceDto,
    @Req() req: any,
  ) {
    const supervisorId = req.user?.id;
    return this.attendanceService.regularizeAttendance(dto, supervisorId);
  }

  @Post('rosters')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async assignShiftRoster(@Body() dto: AssignShiftRosterDto) {
    return this.attendanceService.assignShiftRoster(dto);
  }

  @Get('rosters')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getShiftRosters(@Query('departmentId') departmentId?: string) {
    return this.attendanceService.getShiftRosters(departmentId);
  }

  @Post('leaves')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async applyLeave(@Body() dto: ApplyLeaveDto) {
    return this.attendanceService.applyLeave(dto);
  }

  @Put('leaves/review')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async reviewLeave(@Body() dto: ReviewLeaveDto, @Req() req: any) {
    const reviewerId = req.user?.id;
    return this.attendanceService.reviewLeave(dto, reviewerId);
  }

  @Get('leaves')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getLeaveRequests(
    @Query('status') status?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.attendanceService.getLeaveRequests(status, departmentId);
  }

  @Post('overtime')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async logOvertime(@Body() dto: LogOvertimeDto) {
    return this.attendanceService.logOvertime(dto);
  }

  @Put('overtime/approve')
  @RequirePermissions({ action: 'WRITE', resource: 'HR' })
  async approveOvertime(@Body() dto: ApproveOvertimeDto, @Req() req: any) {
    const supervisorId = req.user?.id;
    return this.attendanceService.approveOvertime(dto, supervisorId);
  }

  @Get('overtime')
  @RequirePermissions({ action: 'READ', resource: 'HR' })
  async getOvertimeRecords(
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('isApproved') isApproved?: string,
  ) {
    const m = month ? parseInt(month) : undefined;
    const y = year ? parseInt(year) : undefined;
    const approved = isApproved !== undefined ? isApproved === 'true' : undefined;
    return this.attendanceService.getOvertimeRecords(m, y, approved);
  }
}
