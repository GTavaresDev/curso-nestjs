import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity()
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
  texto: string;
  @Column({ default: false })
  lido: boolean;
  @CreateDateColumn()
  createdAt?: Date;
  @UpdateDateColumn()
  updatedAt?: Date;

  //Muitos recados podem ser enviados por uma unica pessoa
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'de' }) // Especifica a coluna "de" que armazerna o ID da pessoa que enviou o recado
  de: Usuario;

  //Muitos recados podem ser recebidos por uma unica pessoa
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'para' })
  para: Usuario;

  @Column('simple-array', { nullable: true })
  fotos: string[];
}
