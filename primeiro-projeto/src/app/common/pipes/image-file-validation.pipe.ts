import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as fs from 'fs';

// Assinaturas mágicas dos formatos suportados
const MAGIC_NUMBERS = {
  // JPEG / JPG: FF D8 FF
  jpg: (buf: Buffer) => buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff,
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  png: (buf: Buffer) =>
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a,
  // WEBP: "RIFF" .... "WEBP"
  webp: (buf: Buffer) =>
    buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buf.subarray(8, 12).toString('ascii') === 'WEBP',
  // GIF: "GIF87a" ou "GIF89a"
  gif: (buf: Buffer) => {
    const header = buf.subarray(0, 6).toString('ascii');
    return header === 'GIF87a' || header === 'GIF89a';
  },
};

export interface ImageFileValidationOptions {
  maxSizeBytes?: number; // Padrão: 5MB
  required?: boolean; // Se o arquivo é obrigatório
}

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
  private readonly maxSizeBytes: number;
  private readonly required: boolean;

  constructor(options?: ImageFileValidationOptions) {
    this.maxSizeBytes = options?.maxSizeBytes ?? 5 * 1024 * 1024; // Padrão: 5MB
    this.required = options?.required ?? true;
  }

  async transform(
    value: Express.Multer.File | Express.Multer.File[] | undefined,
    metadata: ArgumentMetadata,
  ) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      if (this.required) {
        throw new BadRequestException('Nenhum arquivo de imagem foi enviado.');
      }
      return value;
    }

    const files = Array.isArray(value) ? value : [value];

    for (const file of files) {
      await this.validateFile(file);
    }

    return value;
  }

  private async validateFile(file: Express.Multer.File): Promise<void> {
    // 1. Validação de tamanho de arquivo
    if (file.size > this.maxSizeBytes) {
      this.cleanupFile(file);
      const maxSizeMb = (this.maxSizeBytes / (1024 * 1024)).toFixed(0);
      throw new BadRequestException(
        `O arquivo ${file.originalname} excede o limite máximo permitido de ${maxSizeMb}MB.`,
      );
    }

    // 2. Validação de cabeçalho MIME superficial
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      this.cleanupFile(file);
      throw new BadRequestException(
        `Tipo de arquivo ${file.mimetype} inválido para ${file.originalname}. Permitidos: JPEG, PNG, WEBP, GIF.`,
      );
    }

    // 3. Validação REAL e PROFUNDA de assinatura de bytes (Magic Numbers)
    // Impede que executáveis renomeados (ex: virus.exe -> foto.jpg) sejam aceitos
    const isValidSignature = await this.validateMagicNumbers(file);
    if (!isValidSignature) {
      this.cleanupFile(file);
      throw new BadRequestException(
        `O conteúdo do arquivo ${file.originalname} não corresponde a uma imagem válida. Assinatura binária incompatível.`,
      );
    }
  }

  private async validateMagicNumbers(file: Express.Multer.File): Promise<boolean> {
    try {
      let buffer: Buffer;

      if (file.buffer) {
        buffer = file.buffer.subarray(0, 16);
      } else if (file.path && fs.existsSync(file.path)) {
        // Para diskStorage, lemos os primeiros 16 bytes diretamente do arquivo gravado
        const fd = fs.openSync(file.path, 'r');
        buffer = Buffer.alloc(16);
        fs.readSync(fd, buffer, 0, 16, 0);
        fs.closeSync(fd);
      } else {
        return false;
      }

      if (buffer.length < 4) {
        return false;
      }

      return (
        MAGIC_NUMBERS.jpg(buffer) ||
        MAGIC_NUMBERS.png(buffer) ||
        MAGIC_NUMBERS.webp(buffer) ||
        MAGIC_NUMBERS.gif(buffer)
      );
    } catch {
      return false;
    }
  }

  private cleanupFile(file: Express.Multer.File): void {
    // Apaga o arquivo do disco imediatamente se a validação falhar
    if (file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch {
        // Silencia erro caso já tenha sido removido
      }
    }
  }
}
