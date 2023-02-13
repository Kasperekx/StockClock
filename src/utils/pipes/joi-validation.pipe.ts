import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}
  transform(value: any, metadata: ArgumentMetadata): any {
    const { error } = this.schema.validate(value, { abortEarly: false });
    const details = error?.details.map((detail) => detail.message).join(', ');
    if (error) {
      throw new BadRequestException(details);
    }
    return value;
  }
}
