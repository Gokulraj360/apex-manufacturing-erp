import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@Controller(['users', 'api/users'])
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('staff')
  @ResponseMessage('Staff registry retrieved successfully')
  async getStaffRegistry() {
    return this.usersService.getStaffRegistry();
  }

  @Post('onboard')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Staff onboarded successfully')
  async onboardStaff(@Body() dto: CreateUserDto) {
    return this.usersService.onboardStaff(dto);
  }

  @Delete(':id/terminate')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Staff terminated and credentials revoked successfully')
  async terminateStaff(@Param('id') id: string) {
    return this.usersService.terminateStaff(id);
  }

  @Patch(':id/salary')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Staff salary adjusted successfully')
  async updateSalary(
    @Param('id') id: string,
    @Body('salary') salary: number
  ) {
    return this.usersService.updateSalary(id, salary);
  }

  @Get()
  @ResponseMessage('Users retrieved successfully')
  async findAll(@Query() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  @ResponseMessage('User details retrieved successfully')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('New user created successfully')
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @ResponseMessage('User updated successfully')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }
}
