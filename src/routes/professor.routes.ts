import { FastifyInstance } from 'fastify';
import { ProfessorController } from '../controllers/professor.controller';

const controller = new ProfessorController();

export async function professorRoutes(app: FastifyInstance) {

  app.get(
    '/',
    {
      schema: {
        tags: ['Professores'],
        summary: 'Listar todos os professores',
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
        tags: ['Professores'],
        summary: 'Buscar professor por ID',
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
        tags: ['Professores'],
        summary: 'Criar novo professor',
        body: {
          type: 'object',
          required: [
            'nome',
            'email',
            'telefone',
            'cpf',
            'especialidades',
            'cargaHoraria',
          ],
          properties: {
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            telefone: { type: 'string' },
            cpf: { type: 'string' },
            especialidades: { type: 'array', items: { type: 'string' } },
            disciplinas: { type: 'array', items: { type: 'string' } },
            bio: { type: 'string' },
            cargaHoraria: { type: 'number' },
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
        tags: ['Professores'],
        summary: 'Atualizar professor',
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
            especialidades: { type: 'array', items: { type: 'string' } },
            disciplinas: { type: 'array', items: { type: 'string' } },
            bio: { type: 'string' },
            cargaHoraria: { type: 'number' },
            status: {
              type: 'string',
              enum: ['ativo', 'inativo', 'suspenso'],
            },
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
        tags: ['Professores'],
        summary: 'Deletar professor',
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
