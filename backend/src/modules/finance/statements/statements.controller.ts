import {
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { StatementsService, StatementSummary } from './statements.service';
import { QueryStatementsDto } from '../dto/statements.dto';
import { Response } from 'express';

@Controller(['finance/statements', 'api/finance/statements'])
export class StatementsController {
  constructor(private readonly statementsService: StatementsService) {}

  @Get('ledger')
  async getLedgerStatements(@Query() query: QueryStatementsDto): Promise<StatementSummary> {
    return this.statementsService.getLedgerStatements(query);
  }

  @Get('export/csv')
  async exportCsvStatement(@Query() query: QueryStatementsDto, @Res() res: Response) {
    const csvData = await this.statementsService.exportCsvStatement(query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="financial_statement_${Date.now()}.csv"`
    );
    res.status(200).send(csvData);
  }
}
