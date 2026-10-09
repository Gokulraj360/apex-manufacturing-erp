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
import { ItemMasterService } from './item-master.service';
import { CreateItemMasterDto } from './dto/create-item-master.dto';
import { UpdateItemMasterDto } from './dto/update-item-master.dto';
import { QueryItemMasterDto } from './dto/query-item-master.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('item-master')
export class ItemMasterController {
  constructor(private readonly itemMasterService: ItemMasterService) {}

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
    Role.INVENTORY,
    Role.PURCHASE,
    Role.QC_MANAGER,
    Role.FINANCE,
  )
  @Get()
  @ResponseMessage('Item Master catalog retrieved successfully')
  async findAll(@Query() query: QueryItemMasterDto) {
    return this.itemMasterService.findAll(query);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC, Role.INVENTORY, Role.PURCHASE)
  @Get('low-stock')
  @ResponseMessage('Low stock alert items retrieved successfully')
  async getLowStockItems() {
    return this.itemMasterService.getLowStockItems();
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
    Role.INVENTORY,
    Role.PURCHASE,
    Role.QC_MANAGER,
    Role.FINANCE,
  )
  @Get(':id')
  @ResponseMessage('Item details retrieved successfully')
  async findOne(@Param('id') id: string) {
    return this.itemMasterService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC, Role.INVENTORY, Role.PURCHASE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Item Master created successfully')
  async create(@Body() dto: CreateItemMasterDto) {
    return this.itemMasterService.create(dto);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.PPC, Role.INVENTORY, Role.PURCHASE)
  @Put(':id')
  @ResponseMessage('Item Master updated successfully')
  async update(@Param('id') id: string, @Body() dto: UpdateItemMasterDto) {
    return this.itemMasterService.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Delete(':id')
  @ResponseMessage('Item Master removed successfully')
  async delete(@Param('id') id: string) {
    return this.itemMasterService.delete(id);
  }
}
