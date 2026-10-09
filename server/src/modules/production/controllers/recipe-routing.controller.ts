import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RecipeRoutingService } from '../services/recipe-routing.service';
import { CreateBomDto, AssemblyRoutingStepDto } from '../dto/recipe-routing.dto';
import { RBACGuard } from '../../../common/guards/rbac.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';

@Controller('api/v1/production/recipes')
@UseGuards(RBACGuard)
export class RecipeRoutingController {
  constructor(private readonly recipeService: RecipeRoutingService) {}

  @Get()
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getAllRecipes() {
    return this.recipeService.getAllRecipes();
  }

  @Get(':sku')
  @RequirePermissions({ action: 'READ', resource: 'PRODUCTION' })
  async getRecipeBySku(@Param('sku') sku: string) {
    return this.recipeService.getRecipeBySku(sku);
  }

  @Post()
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async createRecipe(@Body() dto: CreateBomDto, @Req() req: any) {
    const adminUserId = req.user?.id;
    return this.recipeService.createRecipe(dto, adminUserId);
  }

  @Post(':bomId/routings')
  @RequirePermissions({ action: 'WRITE', resource: 'PRODUCTION' })
  async addRoutingStep(
    @Param('bomId') bomId: string,
    @Body() step: AssemblyRoutingStepDto,
    @Req() req: any,
  ) {
    const adminUserId = req.user?.id;
    return this.recipeService.addRoutingStep(bomId, step, adminUserId);
  }
}
