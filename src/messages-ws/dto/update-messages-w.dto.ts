import { PartialType } from '@nestjs/mapped-types';
import { CreateMessagesWDto } from './create-messages-w.dto';

export class UpdateMessagesWDto extends PartialType(CreateMessagesWDto) {
  id: number;
}
