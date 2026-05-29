import { FastifyInstance } from 'fastify';
import { AlunoController } from '../controllers/aluno.controller';

const controller = new AlunoController();

export async function alunoRoutes(app: FastifyInstance) {

  app.get(
    '/',
    {
      schema: {
        tags: ['Alunos'],
        summary: 'Listar todos os alunos',
        querystring: {
          type: 'object',
          properties: {
            pagina: { type: 'number' },
            limite: { type: 'number' },
            busca: { type: 'string' },
            status: { type: 'string', enum: ['ativo', 'inativo', 'suspenso'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              dados: { type: 'array' },
            },
          },
        },
      },
    },
    controller.listar
  );


  app.get(
    '/:id',
    {
      schema: {
        tags: ['Alunos'],
        summary: 'Buscar aluno por ID',
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              dados: { type: 'object' },
            },
          },
          404: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              erro: { type: 'string' },
            },
          },
        },
      },
    },
    controller.buscarPorId
  );


  app.post(
    '/',
    {
      schema: {
        tags: ['Alunos'],
        summary: 'Criar novo aluno',
        body: {
          type: 'object',
          required: [
            'nome',
            'email',
            'telefone',
            'dataNascimento',
            'cpf',
            'nivelCulinaria',
          ],
          properties: {
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            telefone: { type: 'string' },
            dataNascimento: { type: 'string', format: 'date' },
            cpf: { type: 'string' },
            nivelCulinaria: {
              type: 'string',
              enum: ['iniciante', 'intermediario', 'avancado'],
            },
            turmas: { type: 'array', items: { type: 'string' } },
            observacoes: { type: 'string' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              dados: { type: 'object' },
              mensagem: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              erro: { type: 'string' },
            },
          },
        },
      },
    },
    controller.criar
  );


  app.patch(
    '/:id',
    {
      schema: {
        tags: ['Alunos'],
        summary: 'Atualizar aluno',
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          properties: {
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            telefone: { type: 'string' },
            dataNascimento: { type: 'string', format: 'date' },
            nivelCulinaria: {
              type: 'string',
              enum: ['iniciante', 'intermediario', 'avancado'],
            },
            status: {
              type: 'string',
              enum: ['ativo', 'inativo', 'suspenso'],
            },
            turmas: { type: 'array', items: { type: 'string' } },
            observacoes: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              dados: { type: 'object' },
              mensagem: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              erro: { type: 'string' },
            },
          },
        },
      },
    },
    controller.atualizar
  );


  app.delete(
    '/:id',
    {
      schema: {
        tags: ['Alunos'],
        summary: 'Deletar aluno',
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              mensagem: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              erro: { type: 'string' },
            },
          },
        },
      },
    },
    controller.deletar
  );
}
