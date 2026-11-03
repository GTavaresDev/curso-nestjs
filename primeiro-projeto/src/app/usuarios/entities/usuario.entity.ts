import { IsEmail } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recado } from '../../recados/entities/recado.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 255 })
  name: string;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updateAt?: Date;

  //Uma pessoa pode enviar muitos recados (vinculados ao campo "de")
  // Ou seja na tabela recado no campo "de" fica vincualdo um Usuario
  @OneToMany(() => Recado, (recado) => recado.de)
  recadoEnviados: Recado[];

  //Uma pessoa pode receber muitos recados (vinculados ao campo "para")
  // Ou seja na tabela recado no campo "para" fica vincualdo um Usuario
  @OneToMany(() => Recado, (recado) => recado.para)
  recadoRecebidos: Recado[];
}
