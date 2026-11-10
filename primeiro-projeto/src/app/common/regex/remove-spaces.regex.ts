import { RegexProtocol } from './regex.protocol';

export class RemoveSpacesRegex implements RegexProtocol {
  execute(input: string): string {
    return input.replace(/\s+/g, '');
  }
}
