import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { BlueprintSharingService } from '../services/blueprint-sharing.service';
import {
  ReleaseBlueprintDto,
  CreateDesignSpecificationDto,
  QuerySpecificationsDto,
} from '../dto/blueprint-sharing.dto';

@Controller('api/v1/design/blueprints')
export class BlueprintSharingController {
  constructor(private readonly blueprintService: BlueprintSharingService) {}

  @Get('overview-metrics')
  async getOverviewMetrics() {
    return this.blueprintService.getDesignEngineeringOverviewMetrics();
  }

  @Post('release')
  async releaseBlueprint(@Body() dto: ReleaseBlueprintDto) {
    return this.blueprintService.releaseBlueprint(dto);
  }

  @Get('released')
  async getProductionReleasedBlueprints() {
    return this.blueprintService.getProductionReleasedBlueprints();
  }

  @Get('specifications')
  async getDesignSpecifications(@Query() query: QuerySpecificationsDto) {
    return this.blueprintService.getDesignSpecifications(query);
  }

  @Post('specifications')
  async createDesignSpecification(@Body() dto: CreateDesignSpecificationDto) {
    return this.blueprintService.createDesignSpecification(dto);
  }
}
