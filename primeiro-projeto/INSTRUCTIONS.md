## Comandos úteis

```bash
nest g res recados     # resource: module, controller, service, entity e DTOs
nest g mo recados      # module
nest g s recados       # service
nest g co recados      # controller (o "ca" não existe; o alias certo é "co")
```

Com `--no-spec`, só o arquivo principal é criado (sem o arquivo de teste):

```bash
nest g s recados --no-spec
```

## Testes CRUD com curl

Considerando a API rodando em `http://localhost:3000`.

> **Ordem importante:** todo recado precisa de um remetente (`de`) e de um
> destinatário (`para`), e ambos devem ser **usuários que já existem**.
> Por isso, crie os usuários primeiro e use os IDs retornados nos recados.
> Nos exemplos abaixo, `1` = João (remetente) e `2` = Maria (destinatária).

### Usuários

```bash
# Criar usuário 1 (remetente)
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "passwordHash": "senha-segura-123",
    "name": "João Silva"
  }'

# Criar usuário 2 (destinatário)
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@email.com",
    "passwordHash": "senha-segura-456",
    "name": "Maria Souza"
  }'

# Listar usuários (confira os IDs gerados)
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
```

> O `DELETE` de usuário fica por último (veja a seção
> [Remover usuários](#remover-usuários)), pois um usuário que possui recados
> vinculados não pode ser removido enquanto esses recados existirem.

### Recados

O campo `texto` é obrigatório e deve ter pelo menos 3 caracteres. Os campos
`de` e `para` são obrigatórios e devem ser o **ID (número) de um usuário
existente**, não mais um nome em texto. Se o ID não existir, a API deve
responder com erro (ex.: `404 Not Found`).

```bash
# Criar recado (de: usuário 1 -> para: usuário 2)
curl -X POST http://localhost:3000/recados \
  -H "Content-Type: application/json" \
  -d '{
    "texto": "Não esqueça da reunião",
    "de": 1,
    "para": 2
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
    "de": 1,
    "para": 2
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

### Remover usuários

Remova primeiro os recados vinculados ao usuário e só depois o usuário
(caso contrário o banco rejeita a exclusão por causa da chave estrangeira):

```bash
# 1. Remover os recados que envolvem o usuário
curl -X DELETE http://localhost:3000/recados/1

# 2. Remover o usuário
curl -X DELETE http://localhost:3000/usuarios/1
```

### Casos de erro (para validar)

```bash
# Remetente inexistente -> deve falhar
curl -X POST http://localhost:3000/recados \
  -H "Content-Type: application/json" \
  -d '{"texto":"Teste","de":999,"para":2}'

# Destinatário inexistente -> deve falhar
curl -X POST http://localhost:3000/recados \
  -H "Content-Type: application/json" \
  -d '{"texto":"Teste","de":1,"para":999}'

# Usando nome em vez de ID (formato antigo) -> deve falhar na validação
curl -X POST http://localhost:3000/recados \
  -H "Content-Type: application/json" \
  -d '{"texto":"Teste","de":"João","para":"Maria"}'
```
