import { RegexProtocol } from './regex.protocol';

export class OnlyLowerLettersRegex implements RegexProtocol {
  execute(input: string): string {
    return input.replace(/[^a-z]/g, '');
  }
}
