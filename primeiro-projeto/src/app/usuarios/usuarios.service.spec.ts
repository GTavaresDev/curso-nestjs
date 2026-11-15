import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingServiceProtocol } from '../auth/hasing/hashing.protocol';
import { Recado } from '../recados/entities/recado.entity';
import { RecadosService } from '../recados/recados.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { UsuariosService } from './usuarios.service';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let usuarioRepository: jest.Mocked<Repository<Usuario>>;
  let hashingService: jest.Mocked<HashingServiceProtocol>;
  let recadoRepository: jest.Mocked<Repository<Recado>>;
  let recadosService: jest.Mocked<RecadosService>;

  const mockUsuario: Usuario = {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    passwordHash: 'hashed_password',
    active: true,
    role: 'user',
    picture: '',
    recadoEnviados: [],
    recadoRecebidos: [],
    createdAt: new Date(),
    updateAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            merge: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: HashingServiceProtocol,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Recado),
          useValue: {
            delete: jest.fn(),
          },
        },
        {
          provide: RecadosService,
          useValue: {
            findByUsuarioId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    usuarioRepository = module.get(getRepositoryToken(Usuario));
    hashingService = module.get(HashingServiceProtocol);
    recadoRepository = module.get(getRepositoryToken(Recado));
    recadosService = module.get(RecadosService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUsuarioDto = {
      name: 'João Silva',
      email: 'joao@email.com',
      passwordHash: 'senha123',
    };

    it('deve criar um usuário com sucesso gerando hash da senha', async () => {
      hashingService.hash.mockResolvedValue('hashed_senha123');
      usuarioRepository.create.mockReturnValue({
        ...createUserDto,
        passwordHash: 'hashed_senha123',
      } as Usuario);
      usuarioRepository.save.mockResolvedValue({
        ...mockUsuario,
        passwordHash: 'hashed_senha123',
      });

      const result = await service.create(createUserDto);

      expect(hashingService.hash).toHaveBeenCalledWith('senha123');
      expect(usuarioRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        passwordHash: 'hashed_senha123',
      });
      expect(usuarioRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        ...mockUsuario,
        passwordHash: 'hashed_senha123',
      });
    });

    it('deve lançar ConflictException quando o e-mail for duplicado (código 23505)', async () => {
      hashingService.hash.mockResolvedValue('hashed_senha123');
      usuarioRepository.create.mockReturnValue({
        ...createUserDto,
        passwordHash: 'hashed_senha123',
      } as Usuario);
      usuarioRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException('E-mail já está configurado'),
      );
    });

    it('deve relançar erro genérico ao falhar na criação', async () => {
      const error = new Error('Falha no banco');
      hashingService.hash.mockRejectedValue(error);

      await expect(service.create(createUserDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de usuários', async () => {
      const users = [mockUsuario];
      usuarioRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(usuarioRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('deve retornar o usuário quando encontrado pelo ID', async () => {
      usuarioRepository.findOneBy.mockResolvedValue(mockUsuario);

      const result = await service.findOne(1);

      expect(usuarioRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUsuario);
    });

    it('deve lançar NotFoundException quando o usuário não existir', async () => {
      usuarioRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Não temos esse usuário cadastrado no sistema'),
      );
    });
  });

  describe('findRecados', () => {
    it('deve retornar os recados do usuário após verificar sua existência', async () => {
      usuarioRepository.findOneBy.mockResolvedValue(mockUsuario);
      const recados = [
        {
          id: 1,
          texto: 'Recado 1',
          lido: false,
          de: mockUsuario,
          para: mockUsuario,
          fotos: [],
        },
      ] as any;
      recadosService.findByUsuarioId.mockResolvedValue(recados);

      const result = await service.findRecados(1);

      expect(usuarioRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(recadosService.findByUsuarioId).toHaveBeenCalledWith(1);
      expect(result).toEqual(recados);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      usuarioRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findRecados(999)).rejects.toThrow(
        new NotFoundException('Não temos esse usuário cadastrado no sistema'),
      );
      expect(recadosService.findByUsuarioId).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateDto: UpdateUsuarioDto = {
      name: 'João Atualizado',
    };

    it('deve atualizar o usuário com sucesso sem alterar a senha', async () => {
      const existingUser = { ...mockUsuario };
      usuarioRepository.findOneBy.mockResolvedValue(existingUser);
      usuarioRepository.merge.mockImplementation(
        (entity, dto) => Object.assign(entity, dto) as Usuario,
      );
      const updatedUser = { ...existingUser, ...updateDto };
      usuarioRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateDto);

      expect(usuarioRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(hashingService.hash).not.toHaveBeenCalled();
      expect(usuarioRepository.merge).toHaveBeenCalledWith(existingUser, {
        name: 'João Atualizado',
      });
      expect(usuarioRepository.save).toHaveBeenCalledWith(existingUser);
      expect(result).toEqual(updatedUser);
    });

    it('deve atualizar a senha com hash quando passwordHash for enviado', async () => {
      const existingUser = { ...mockUsuario };
      const dtoComSenha: UpdateUsuarioDto = {
        name: 'João',
        passwordHash: 'novaSenha123',
      };
      usuarioRepository.findOneBy.mockResolvedValue(existingUser);
      hashingService.hash.mockResolvedValue('novo_hash');
      usuarioRepository.merge.mockImplementation(
        (entity, dto) => Object.assign(entity, dto) as Usuario,
      );
      usuarioRepository.save.mockResolvedValue(existingUser);

      await service.update(1, dtoComSenha);

      expect(hashingService.hash).toHaveBeenCalledWith('novaSenha123');
      expect(existingUser.passwordHash).toBe('novo_hash');
      expect(usuarioRepository.merge).toHaveBeenCalledWith(existingUser, {
        name: 'João',
      });
      expect(usuarioRepository.save).toHaveBeenCalledWith(existingUser);
    });

    it('deve lançar NotFoundException quando o usuário não existir', async () => {
      usuarioRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        new NotFoundException('Não temos esse usuário cadastrado no sistema'),
      );
    });

    it('deve lançar ForbiddenException quando tokenPayload.sub for diferente do ID do usuário', async () => {
      usuarioRepository.findOneBy.mockResolvedValue(mockUsuario);

      await expect(service.update(1, updateDto, { sub: 2 })).rejects.toThrow(
        new ForbiddenException(
          'Você não tem autorização para atualizar os dados de outro usuário.',
        ),
      );
    });

    it('deve permitir a atualização se tokenPayload.sub for igual ao ID do usuário', async () => {
      const existingUser = { ...mockUsuario };
      usuarioRepository.findOneBy.mockResolvedValue(existingUser);
      usuarioRepository.merge.mockImplementation(
        (entity, dto) => Object.assign(entity, dto) as Usuario,
      );
      usuarioRepository.save.mockResolvedValue(existingUser);

      await expect(
        service.update(1, updateDto, { sub: 1 }),
      ).resolves.not.toThrow();
    });

    it('deve lançar ConflictException quando houver e-mail duplicado (código 23505)', async () => {
      const existingUser = { ...mockUsuario };
      usuarioRepository.findOneBy.mockResolvedValue(existingUser);
      usuarioRepository.save.mockRejectedValue({ code: '23505' });

      await expect(
        service.update(1, { email: 'outro@email.com' }),
      ).rejects.toThrow(new ConflictException('E-mail já está configurado'));
    });

    it('deve relançar erro genérico se o save falhar', async () => {
      const existingUser = { ...mockUsuario };
      const dbError = new Error('Erro no DB');
      usuarioRepository.findOneBy.mockResolvedValue(existingUser);
      usuarioRepository.save.mockRejectedValue(dbError);

      await expect(service.update(1, updateDto)).rejects.toThrow(dbError);
    });
  });

  describe('remove', () => {
    it('deve remover o usuário e apagar seus recados vinculados', async () => {
      usuarioRepository.findOneBy.mockResolvedValue(mockUsuario);
      recadoRepository.delete.mockResolvedValue({ raw: [], affected: 2 });
      usuarioRepository.remove.mockResolvedValue(mockUsuario);

      const result = await service.remove(1);

      expect(usuarioRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(recadoRepository.delete).toHaveBeenCalledWith([
        { de: { id: 1 } },
        { para: { id: 1 } },
      ]);
      expect(usuarioRepository.remove).toHaveBeenCalledWith(mockUsuario);
      expect(result).toEqual(mockUsuario);
    });

    it('deve lançar NotFoundException quando o usuário não for encontrado', async () => {
      usuarioRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Não temos esse usuário cadastrado no sistema'),
      );
    });

    it('deve lançar NotFoundException quando falhar ao apagar os recados vinculados', async () => {
      usuarioRepository.findOneBy.mockResolvedValue(mockUsuario);
      recadoRepository.delete.mockRejectedValue(new Error('Falha ao deletar'));

      await expect(service.remove(1)).rejects.toThrow(
        new NotFoundException(
          'Não foi possivel apagar os recados desse usuario ',
        ),
      );
      expect(usuarioRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('uploadPicture', () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'perfil.png',
      encoding: '7bit',
      mimetype: 'image/png',
      size: 1024,
      destination: './uploads',
      filename: 'perfil-123.png',
      path: 'uploads/perfil-123.png',
      buffer: Buffer.from([]),
      stream: null as any,
    } as Express.Multer.File;

    it('deve fazer upload de foto de perfil com sucesso', async () => {
      const user = { ...mockUsuario };
      usuarioRepository.findOneBy.mockResolvedValue(user);
      usuarioRepository.save.mockResolvedValue(user);

      const result = await service.uploadPicture(mockFile, { sub: 1 });

      expect(usuarioRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(user.picture).toBe('uploads/perfil-123.png');
      expect(usuarioRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual({
        message: 'Foto de perfil atualizada com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: 'uploads/perfil-123.png',
        },
      });
    });

    it('deve lançar NotFoundException quando o arquivo não for enviado', async () => {
      await expect(
        service.uploadPicture(undefined as any, { sub: 1 }),
      ).rejects.toThrow(
        new NotFoundException('Arquivo de imagem não enviado.'),
      );
    });

    it('deve lançar NotFoundException quando o usuário do token não for encontrado', async () => {
      usuarioRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.uploadPicture(mockFile, { sub: 999 }),
      ).rejects.toThrow(
        new NotFoundException('Não temos esse usuário cadastrado no sistema'),
      );
    });
  });
});
