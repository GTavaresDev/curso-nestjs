import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }

    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException(`A rota espera um número como param`);
    }

    if (parsedValue < 0) {
      throw new BadRequestException(
        `A rota espera um número positivo como param`,
      );
    }

    return parsedValue;
  }
}
