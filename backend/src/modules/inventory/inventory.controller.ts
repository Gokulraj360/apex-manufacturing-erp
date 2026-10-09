import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  CreateInventoryItemDto,
  CreateStockMovementDto,
  AllocatePutawayDto,
  WarehouseZone,
} from './dto/inventory.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/jwt-payload.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.INVENTORY,
    Role.PURCHASE,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
    Role.DISPATCH,
    Role.FINANCE,
  )
  @Get('warehouse/matrix')
  @ResponseMessage('Warehouse bin & rack matrix retrieved successfully')
  async getWarehouseMatrix(@Query('zone') zone?: WarehouseZone) {
    return this.inventoryService.getWarehouseMatrix(zone);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.INVENTORY, Role.PURCHASE, Role.PPC)
  @Get('warehouse/reorder-alerts')
  @ResponseMessage('Low stock reorder alerts retrieved successfully')
  async getReorderAlerts() {
    return this.inventoryService.getReorderAlerts();
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.INVENTORY)
  @Post('warehouse/putaway')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Warehouse putaway allocated successfully')
  async allocatePutaway(@Body() dto: AllocatePutawayDto) {
    return this.inventoryService.allocatePutaway(dto);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.INVENTORY,
    Role.PURCHASE,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
    Role.DISPATCH,
    Role.FINANCE,
  )
  @Get()
  @ResponseMessage('Inventory catalog retrieved successfully')
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('category') category?: string,
  ) {
    return this.inventoryService.findAll(pagination, category);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.INVENTORY,
    Role.PURCHASE,
    Role.PPC,
    Role.PRODUCTION_SUPERVISOR,
  )
  @Get(':id')
  @ResponseMessage('Inventory item details retrieved successfully')
  async findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.OWNER, Role.INVENTORY, Role.PURCHASE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Inventory item created successfully')
  async create(@Body() dto: CreateInventoryItemDto) {
    return this.inventoryService.create(dto);
  }

  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.INVENTORY,
    Role.PRODUCTION_SUPERVISOR,
    Role.DISPATCH,
    Role.GATE_SECURITY,
  )
  @Post('movements')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Stock movement recorded successfully')
  async recordMovement(
    @Body() dto: CreateStockMovementDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.inventoryService.recordStockMovement(dto, user?.id);
  }
}
