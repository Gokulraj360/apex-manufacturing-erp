import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { BOMService } from './bom.service';
import {
  CreateBOMDto,
  UpdateBOMDto,
  AddBOMItemDto,
  UpdateBOMItemDto,
} from './dto/bom.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bom')
export class BOMController {
  constructor(private readonly bomService: BOMService) {}

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
    Role.INVENTORY,
    Role.PURCHASE,
  )
  @Get()
  @ResponseMessage('Bills of Material retrieved successfully')
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('search') search?: string,
  ) {
    return this.bomService.findAll(pagination, search);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
    Role.INVENTORY,
    Role.PURCHASE,
  )
  @Get(':id')
  @ResponseMessage('Bill of Material details retrieved successfully')
  async findOne(@Param('id') id: string) {
    return this.bomService.findOne(id);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
    Role.INVENTORY,
    Role.PURCHASE,
  )
  @Get(':id/tree')
  @ResponseMessage('Multi-level BOM tree hierarchy retrieved successfully')
  async getBOMTree(@Param('id') id: string) {
    return this.bomService.getBOMTree(id);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC, Role.PRODUCTION_SUPERVISOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Bill of Material defined successfully')
  async create(@Body() dto: CreateBOMDto) {
    return this.bomService.create(dto);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC, Role.PRODUCTION_SUPERVISOR)
  @Put(':id')
  @ResponseMessage('Bill of Material updated successfully')
  async update(@Param('id') id: string, @Body() dto: UpdateBOMDto) {
    return this.bomService.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC)
  @Delete(':id')
  @ResponseMessage('Bill of Material deleted successfully')
  async delete(@Param('id') id: string) {
    return this.bomService.delete(id);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC, Role.PRODUCTION_SUPERVISOR)
  @Post(':id/components')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Component added to BOM successfully')
  async addComponent(
    @Param('id') bomId: string,
    @Body() dto: AddBOMItemDto,
  ) {
    return this.bomService.addComponent(bomId, dto);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC, Role.PRODUCTION_SUPERVISOR)
  @Put(':id/components/:itemId')
  @ResponseMessage('BOM component updated successfully')
  async updateComponent(
    @Param('id') bomId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateBOMItemDto,
  ) {
    return this.bomService.updateComponent(bomId, itemId, dto);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC, Role.PRODUCTION_SUPERVISOR)
  @Delete(':id/components/:itemId')
  @ResponseMessage('Component removed from BOM successfully')
  async removeComponent(
    @Param('id') bomId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.bomService.removeComponent(bomId, itemId);
  }
}
