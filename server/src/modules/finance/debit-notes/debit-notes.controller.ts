import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DebitNotesService, DebitNoteRecord, RTVDeliverySlip } from './debit-notes.service';
import { CreateDebitNoteDto, RejectLotTriggerDto } from './dto/debit-note.dto';

@Controller(['finance/debit-notes', 'api/finance/debit-notes'])
export class DebitNotesController {
  constructor(private readonly debitNotesService: DebitNotesService) {}

  @Get()
  async findAll(): Promise<DebitNoteRecord[]> {
    return this.debitNotesService.findAllDebitNotes();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DebitNoteRecord> {
    return this.debitNotesService.findOneDebitNote(id);
  }

  @Get(':id/rtv-slip')
  async getRTVDeliverySlip(@Param('id') id: string): Promise<RTVDeliverySlip> {
    return this.debitNotesService.getRTVDeliverySlip(id);
  }

  @Post('reject-lot')
  @HttpCode(HttpStatus.CREATED)
  async rejectLotAndTriggerDebitNote(@Body() dto: RejectLotTriggerDto) {
    return this.debitNotesService.rejectLotAndTriggerDebitNote(dto);
  }
}
