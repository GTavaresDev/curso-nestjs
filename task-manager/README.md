ROTAS FRONTEND

GET /
GET /tasks/:userId

ROTAS BACKEND

GET /

POST /users
GET /users
GET /users/:id
PATCH /users/:id
DELETE /users/:id

POST /tasks
GET /tasks
GET /tasks/user/:id
GET /tasks/:id
PATCH /tasks/:id
DELETE /tasks/:id

CURL

API_URL=http://localhost:3001

curl "$API_URL/"

curl -X POST "$API_URL/users" \
 -H "Content-Type: application/json" \
 -d '{"name":"Gabriel Tavares"}'

curl "$API_URL/users"
curl "$API_URL/users/2"

curl -X PATCH "$API_URL/users/2" \
 -H "Content-Type: application/json" \
 -d '{"name":"Gabriel Tavares Atualizado"}'

curl -X DELETE "$API_URL/users/2"

curl -X POST "$API_URL/tasks" \
 -H "Content-Type: application/json" \
 -d '{"name":2,"content":"Estudar NestJS"}'

curl "$API_URL/tasks"
curl "$API_URL/tasks/user/2"
curl "$API_URL/tasks/1"

curl -X PATCH "$API_URL/tasks/1" \
 -H "Content-Type: application/json" \
 -d '{"content":"Estudar NestJS e TypeORM"}'

curl -X DELETE "$API_URL/tasks/1"
