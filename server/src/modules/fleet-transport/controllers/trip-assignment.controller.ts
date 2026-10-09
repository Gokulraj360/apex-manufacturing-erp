import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TripAssignmentService } from '../services/trip-assignment.service';
import {
  CreateTripAssignmentDto,
  UpdateTripAssignmentDto,
  QueryAssignmentsDto,
} from '../dto/trip-assignment.dto';

@Controller('api/v1/fleet/assignments')
export class TripAssignmentController {
  constructor(private readonly assignmentService: TripAssignmentService) {}

  @Get()
  async getAssignments(@Query() query: QueryAssignmentsDto) {
    return this.assignmentService.getAssignments(query);
  }

  @Get('analytics/summary')
  async getAssignmentStatistics() {
    return this.assignmentService.getAssignmentStatistics();
  }

  @Get(':id')
  async getAssignmentById(@Param('id') id: string) {
    return this.assignmentService.getAssignmentById(id);
  }

  @Post()
  async createAssignment(@Body() dto: CreateTripAssignmentDto) {
    return this.assignmentService.createAssignment(dto);
  }

  @Patch(':id')
  async updateAssignment(
    @Param('id') id: string,
    @Body() dto: UpdateTripAssignmentDto,
  ) {
    return this.assignmentService.updateAssignment(id, dto);
  }

  @Delete(':id')
  async deleteAssignment(@Param('id') id: string) {
    return this.assignmentService.deleteAssignment(id);
  }
}
