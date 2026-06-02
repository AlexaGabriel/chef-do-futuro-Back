# 🔐 Sistema de Autenticação

## Visão Geral

A API utiliza JWT (JSON Web Tokens) para autenticação. Cada tipo de usuário (Aluno, Professor, Coordenador) possui seu próprio endpoint de login.

## Tecnologias

- **bcrypt**: Hash seguro de senhas (10 rounds de salt)
- **jsonwebtoken**: Geração e validação de tokens JWT
- **Middleware de autenticação**: Proteção de rotas por role

## Endpoints de Login

### POST /api/v1/auth/aluno/login
Login para alunos.

**Request:**
```json
{
  "email": "maria.silva@email.com",
  "senha": "senha123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid",
    "nome": "Maria Silva",
    "email": "maria.silva@email.com",
    "role": "ALUNO"
  }
}
```

### POST /api/v1/auth/professor/login
Login para professores.

**Request:**
```json
{
  "email": "carlos.mendes@escola.com",
  "senha": "senha123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid",
    "nome": "Chef Carlos Mendes",
    "email": "carlos.mendes@escola.com",
    "role": "PROFESSOR"
  }
}
```

### POST /api/v1/auth/coordenador/login
Login para coordenadores.

**Request:**
```json
{
  "email": "fernanda.lima@escola.com",
  "senha": "senha123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid",
    "nome": "Fernanda Lima",
    "email": "fernanda.lima@escola.com",
    "role": "COORDENADOR"
  }
}
```

## Respostas de Erro

### 401 Unauthorized
Credenciais inválidas:
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Credenciais inválidas"
}
```

### 403 Forbidden
Usuário inativo:
```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Usuário inativo"
}
```

## Usando o Token

Após o login bem-sucedido, inclua o token JWT no header `Authorization` das requisições protegidas:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Exemplo de Requisição Protegida

```http
GET /api/v1/perfil HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Middlewares de Autorização

A API possui 5 middlewares para controle de acesso:

### `authMiddleware`
Valida o token JWT e adiciona os dados do usuário à requisição. Use em rotas que precisam saber quem é o usuário logado.

### `requireAluno`
Permite acesso apenas a alunos autenticados.

### `requireProfessor`
Permite acesso apenas a professores autenticados.

### `requireCoordenador`
Permite acesso apenas a coordenadores autenticados.

### `requireProfessorOrCoordenador`
Permite acesso a professores OU coordenadores autenticados.

## Payload do Token JWT

O token contém as seguintes informações:

```typescript
{
  id: string;        // UUID do usuário
  email: string;     // Email do usuário
  role: UserRole;    // "ALUNO" | "PROFESSOR" | "COORDENADOR"
  iat: number;       // Timestamp de criação
  exp: number;       // Timestamp de expiração
}
```

## Configuração

As seguintes variáveis de ambiente são necessárias:

```env
JWT_SECRET="sua_chave_secreta_super_segura_aqui"
JWT_EXPIRES_IN="7d"
```

## Usuários de Teste

Após popular o banco com o seed, os seguintes usuários estão disponíveis (todos com senha `senha123`):

### Alunos
- maria.silva@email.com
- joao.santos@email.com
- ana.costa@email.com

### Professores
- carlos.mendes@escola.com
- patricia.oliveira@escola.com
- roberto.alves@escola.com

### Coordenadores
- fernanda.lima@escola.com
- ricardo.pereira@escola.com

## Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant C as Cliente
    participant A as API
    participant DB as Database

    C->>A: POST /auth/{tipo}/login
    A->>DB: Buscar usuário por email
    DB-->>A: Dados do usuário
    A->>A: Verificar senha (bcrypt)
    A->>A: Gerar token JWT
    A-->>C: { token, usuario }
    
    Note over C: Armazena token
    
    C->>A: GET /endpoint (com token)
    A->>A: Validar token JWT
    A->>A: Verificar permissões
    A->>DB: Executar operação
    DB-->>A: Resultado
    A-->>C: Resposta
```

## Segurança

- ✅ Senhas nunca são armazenadas em texto plano
- ✅ Usa bcrypt com 10 rounds de salt
- ✅ Tokens JWT possuem tempo de expiração configurável
- ✅ Validação de email e senha obrigatórios
- ✅ Verificação de status do usuário (ativo/inativo)
- ✅ Middlewares role-based para controle de acesso

## Exemplos com cURL

### Login Aluno
```bash
curl -X POST http://localhost:3000/api/v1/auth/aluno/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria.silva@email.com","senha":"senha123"}'
```

### Login Professor
```bash
curl -X POST http://localhost:3000/api/v1/auth/professor/login \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos.mendes@escola.com","senha":"senha123"}'
```

### Login Coordenador
```bash
curl -X POST http://localhost:3000/api/v1/auth/coordenador/login \
  -H "Content-Type: application/json" \
  -d '{"email":"fernanda.lima@escola.com","senha":"senha123"}'
```

### Requisição com Token
```bash
curl -X GET http://localhost:3000/api/v1/perfil \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```
