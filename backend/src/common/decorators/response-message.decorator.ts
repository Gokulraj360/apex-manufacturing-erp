import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_METADATA_KEY = 'response_message_metadata_key';

/**
 * Decorator to assign a custom user-facing message to the wrapped API response.
 * @example
 * @ResponseMessage('Work order created successfully')
 * @Post()
 * create(...)
 */
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_METADATA_KEY, message);
