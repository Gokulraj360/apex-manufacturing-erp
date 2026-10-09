import { SupportTicketPriority, SupportTicketStatus } from '@prisma/client';

export class CreateSupportTicketDto {
  title!: string;
  description!: string;
  category!: 'HARDWARE_TERMINAL' | 'NETWORK_CONNECTIVITY' | 'BARCODE_PRINTER' | 'USER_ACCESS' | 'IOT_SENSOR' | 'OTHER';
  priority?: SupportTicketPriority;
  reportedByName!: string;
  affectedLocation?: string;
}

export class UpdateSupportTicketDto {
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  assignedToEngineer?: string;
  resolutionNotes?: string;
}

export class ResolveSupportTicketDto {
  ticketId!: string;
  resolutionNotes!: string;
  resolvedByEngineer!: string;
}
