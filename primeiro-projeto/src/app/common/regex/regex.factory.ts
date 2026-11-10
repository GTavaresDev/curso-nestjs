import { InternalServerErrorException, Injectable } from '@nestjs/common';
import { RegexProtocol } from './regex.protocol';
import { OnlyLowerLettersRegex } from './only-lower-letters.regex';
import { RemoveSpacesRegex } from './remove-spaces.regex';

export type ClassNames = 'OnlyLowerLettersRegex' | 'RemoveSpacesRegex';

@Injectable()
export class RegexFactory {
  create(className: ClassNames): RegexProtocol {
    switch (className) {
      case 'OnlyLowerLettersRegex':
        return new OnlyLowerLettersRegex();
      case 'RemoveSpacesRegex':
        return new RemoveSpacesRegex();
      default:
        throw new InternalServerErrorException(
          `No class found for ${className}`,
        );
    }
  }
}
