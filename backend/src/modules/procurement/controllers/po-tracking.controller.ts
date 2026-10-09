import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { POTrackingService } from '../services/po-tracking.service';
import {
  UpdatePODeliveryScheduleDto,
  ModifyPOItemsDto,
  SendDeliveryReminderDto,
  UpdatePOStatusDto,
} from '../dto/po-tracking.dto';

@Controller('api/v1/procurement/tracking')
export class POTrackingController {
  constructor(private readonly poTrackingService: POTrackingService) {}

  @Get('board')
  async getDeliveryScheduleBoard() {
    return this.poTrackingService.getDeliveryScheduleBoard();
  }

  @Patch(':id/delivery-schedule')
  async updatePODeliverySchedule(
    @Param('id') id: string,
    @Body() dto: UpdatePODeliveryScheduleDto,
  ) {
    return this.poTrackingService.updatePODeliverySchedule(id, dto);
  }

  @Patch(':id/items')
  async modifyPOItems(
    @Param('id') id: string,
    @Body() dto: ModifyPOItemsDto,
  ) {
    return this.poTrackingService.modifyPOItems(id, dto);
  }

  @Post(':id/send-reminder')
  async sendDeliveryReminder(
    @Param('id') id: string,
    @Body() dto: SendDeliveryReminderDto,
  ) {
    return this.poTrackingService.sendDeliveryReminder(id, dto);
  }

  @Patch(':id/status')
  async updatePOStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePOStatusDto,
  ) {
    return this.poTrackingService.updatePOStatus(id, dto);
  }
}
