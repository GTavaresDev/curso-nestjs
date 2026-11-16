export class ResponseRecadoDto {
  id: number;
  texto: string;
  lido: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  de: {
    id: number;
    name: string;
    email: string;
  };
  para: {
    id: number;
    name: string;
    email: string;
  };
  fotos?: string[];
}
