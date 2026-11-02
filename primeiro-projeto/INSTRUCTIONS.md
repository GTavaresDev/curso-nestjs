## Comandos uteis

```bash
nest g res recados     # resource: module, controller, service, entity e DTOs
nest g mo recados      # module
nest g s recados       # service
nest g co recados      # controller (o "ca" não existe; o alias certo é "co")
```

```

Com `--no-spec`, só o arquivo principal é criado:
```

## Testes CRUD com curl

Considerando a API rodando em `http://localhost:3000`.

### Usuários

```bash
# Criar usuário
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "passwordHash": "senha-segura-123",
    "name": "João Silva"
  }'

# Listar usuários
curl http://localhost:3000/usuarios

# Buscar usuário por ID
curl http://localhost:3000/usuarios/1

# Atualizar usuário
curl -X PATCH http://localhost:3000/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Santos",
    "email": "joao.santos@email.com",
    "passwordHash": "nova-senha-123"
  }'

# Atualizar somente o nome
curl -X PATCH http://localhost:3000/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"João Santos"}'

# Remover usuário
curl -X DELETE http://localhost:3000/usuarios/1
```

### Recados

Os campos `texto`, `de` e `para` são obrigatórios e devem ter pelo menos 3 caracteres.

```bash
# Criar recado
curl -X POST http://localhost:3000/recados \
  -H "Content-Type: application/json" \
  -d '{
    "texto": "Não esqueça da reunião",
    "de": "João",
    "para": "Maria"
  }'

# Listar recados
curl http://localhost:3000/recados

# Buscar recado por ID
curl http://localhost:3000/recados/1

# Atualizar recado
curl -X PATCH http://localhost:3000/recados/1 \
  -H "Content-Type: application/json" \
  -d '{
    "texto": "Reunião alterada para amanhã",
    "de": "João",
    "para": "Maria"
  }'

# Atualizar somente o texto
curl -X PATCH http://localhost:3000/recados/1 \
  -H "Content-Type: application/json" \
  -d '{"texto":"Mensagem atualizada"}'

# Remover recado
curl -X DELETE http://localhost:3000/recados/1
```

O campo `lido` não precisa ser enviado ao criar o recado, pois o serviço define
automaticamente `lido: false`.
