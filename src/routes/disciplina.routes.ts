import { FastifyInstance } from 'fastify';
import { DisciplinaController } from '../controllers/disciplina.controller';

const controller = new DisciplinaController();

export async function disciplinaRoutes(app: FastifyInstance) {

  app.get(
    '/',
    {
      schema: {
        tags: ['Disciplinas'],
        summary: 'Listar disciplinas de um curso',
        params: {
          type: 'object',
          properties: {
            cursoId: { type: 'string' },
          },
          required: ['cursoId'],
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
        tags: ['Disciplinas'],
        summary: 'Buscar disciplina por ID',
        params: {
          type: 'object',
          properties: {
            cursoId: { type: 'string' },
            id: { type: 'string' },
          },
          required: ['cursoId', 'id'],
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
        tags: ['Disciplinas'],
        summary: 'Criar nova disciplina em um curso',
        params: {
          type: 'object',
          properties: {
            cursoId: { type: 'string' },
          },
          required: ['cursoId'],
        },
        body: {
          type: 'object',
          required: ['nome', 'codigo', 'cargaHoraria', 'periodo'],
          properties: {
            nome: { type: 'string' },
            codigo: { type: 'string' },
            cargaHoraria: { type: 'number' },
            ementa: { type: 'string' },
            periodo: { type: 'string' },
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
    controller.criar
  );

  app.patch(
    '/:id',
    {
      schema: {
        tags: ['Disciplinas'],
        summary: 'Atualizar disciplina',
        params: {
          type: 'object',
          properties: {
            cursoId: { type: 'string' },
            id: { type: 'string' },
          },
          required: ['cursoId', 'id'],
        },
        body: {
          type: 'object',
          properties: {
            nome: { type: 'string' },
            codigo: { type: 'string' },
            cargaHoraria: { type: 'number' },
            ementa: { type: 'string' },
            periodo: { type: 'string' },
            status: {
              type: 'string',
              enum: ['ativa', 'inativa'],
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
        tags: ['Disciplinas'],
        summary: 'Deletar disciplina',
        params: {
          type: 'object',
          properties: {
            cursoId: { type: 'string' },
            id: { type: 'string' },
          },
          required: ['cursoId', 'id'],
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
