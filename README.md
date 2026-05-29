# 🍳 Escola de Culinária — API

Backend REST para gerenciamento de alunos, professores e coordenadores.

**Stack:** Node.js · TypeScript · Fastify · UUID · Zod

---

## Instalação e execução

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento (hot-reload)
npm run dev

# Compilar para produção
npm run build
npm start
```

A API sobe em `http://localhost:3000`.  
Documentação interativa (Swagger UI): `http://localhost:3000/docs`

---

## Estrutura do projeto

```
src/
├── types/          # Interfaces e enums TypeScript
├── db/             # Banco de dados em memória + seed
├── repositories/   # Acesso a dados (CRUD direto no Map)
├── controllers/    # Lógica de negócio + respostas HTTP
├── routes/         # Definição das rotas + schemas JSON
├── app.ts          # Factory do Fastify (plugins, rotas, handlers)
└── server.ts       # Entry point
```

> **Banco de dados:** atualmente usa `Map<string, Entity>` em memória para
> facilitar o início do desenvolvimento. Para produção, substitua os
> repositories por um ORM (Prisma, Drizzle) apontando para PostgreSQL.

---

## Endpoints

### Health

| Método | Rota      | Descrição            |
|--------|-----------|----------------------|
| GET    | /health   | Status da API        |

### Alunos — `/api/v1/alunos`

| Método | Rota            | Descrição                         |
|--------|-----------------|-----------------------------------|
| GET    | /               | Listar alunos (paginação + busca) |
| GET    | /:id            | Buscar aluno por ID               |
| POST   | /               | Cadastrar novo aluno              |
| PATCH  | /:id            | Atualizar dados do aluno          |
| DELETE | /:id            | Remover aluno                     |

**Query params para listagem:** `pagina`, `limite`, `busca`, `status`

**Corpo para criar aluno:**
```json
{
  "nome": "Maria Silva",
  "email": "maria@exemplo.com",
  "telefone": "(11) 91234-5678",
  "dataNascimento": "2000-05-10",
  "cpf": "123.456.789-00",
  "nivelCulinaria": "iniciante",
  "observacoes": "Vegana"
}
```

---

### Professores — `/api/v1/professores`

| Método | Rota            | Descrição                              |
|--------|-----------------|----------------------------------------|
| GET    | /               | Listar professores (paginação + busca) |
| GET    | /:id            | Buscar professor por ID                |
| POST   | /               | Cadastrar novo professor               |
| PATCH  | /:id            | Atualizar dados do professor           |
| DELETE | /:id            | Remover professor                      |

**Corpo para criar professor:**
```json
{
  "nome": "Chef João Souza",
  "email": "joao@escola.com",
  "telefone": "(11) 98000-1111",
  "cpf": "987.654.321-00",
  "especialidades": ["Sushi", "Culinária Japonesa"],
  "cargaHoraria": 20,
  "bio": "10 anos em restaurantes japoneses."
}
```

---

### Coordenadores — `/api/v1/coordenadores`

| Método | Rota            | Descrição                                |
|--------|-----------------|------------------------------------------|
| GET    | /               | Listar coordenadores (paginação + busca) |
| GET    | /:id            | Buscar coordenador por ID                |
| POST   | /               | Cadastrar novo coordenador               |
| PATCH  | /:id            | Atualizar dados do coordenador           |
| DELETE | /:id            | Remover coordenador                      |

**Permissões disponíveis:**
`gerenciar_alunos` · `gerenciar_professores` · `gerenciar_turmas` ·
`gerenciar_disciplinas` · `emitir_relatorios` · `gerenciar_financeiro`

**Corpo para criar coordenador:**
```json
{
  "nome": "Dr. Ricardo Alves",
  "email": "ricardo@escola.com",
  "telefone": "(11) 3000-9999",
  "cpf": "111.333.555-77",
  "departamento": "Coordenação Pedagógica",
  "permissoes": ["gerenciar_alunos", "emitir_relatorios"],
  "ramal": "202"
}
```

---

## Próximos passos sugeridos

- [ ] Substituir o banco em memória por **PostgreSQL + Prisma**
- [ ] Adicionar **autenticação JWT** por role (aluno / professor / coordenador)
- [ ] Criar entidades de **Turmas** e **Disciplinas**
- [ ] Adicionar **upload de foto** de perfil (Fastify Multipart)
- [ ] Implementar **testes** com Vitest / Jest
- [ ] Configurar **Docker** + `docker-compose`
