import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { DepartmentAttendanceService } from '../services/department-attendance.service';
import {
  LogDepartmentAttendanceDto,
  ApproveOvertimeDto,
  ApproveDeptLeaveDto,
  QueryAttendanceDto,
} from '../dto/department-attendance.dto';

@Controller('api/v1/department-workforce/attendance')
export class DepartmentAttendanceController {
  constructor(
    private readonly attendanceService: DepartmentAttendanceService,
  ) {}

  @Get()
  async getAttendanceLogs(@Query() query: QueryAttendanceDto) {
    return this.attendanceService.getAttendanceLogs(query);
  }

  @Get(':id')
  async getAttendanceById(@Param('id') id: string) {
    return this.attendanceService.getAttendanceById(id);
  }

  @Post()
  async logAttendance(@Body() dto: LogDepartmentAttendanceDto) {
    return this.attendanceService.logAttendance(dto);
  }

  @Patch(':id/overtime')
  async approveOvertime(
    @Param('id') id: string,
    @Body() dto: ApproveOvertimeDto,
  ) {
    return this.attendanceService.approveOvertime(id, dto);
  }

  @Patch(':id/leave')
  async approveLeave(
    @Param('id') id: string,
    @Body() dto: ApproveDeptLeaveDto,
  ) {
    return this.attendanceService.approveLeave(id, dto);
  }
}
