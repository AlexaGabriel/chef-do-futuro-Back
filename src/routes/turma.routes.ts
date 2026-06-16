import { FastifyInstance } from 'fastify';
import { TurmaController } from '../controllers/turma.controller';

const controller = new TurmaController();

export async function turmaRoutes(app: FastifyInstance) {

  app.get(
    '/',
    {
      schema: {
        tags: ['Turmas'],
        summary: 'Listar turmas de um curso',
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
        tags: ['Turmas'],
        summary: 'Buscar turma por ID',
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
        tags: ['Turmas'],
        summary: 'Criar nova turma em um curso',
        params: {
          type: 'object',
          properties: {
            cursoId: { type: 'string' },
          },
          required: ['cursoId'],
        },
        body: {
          type: 'object',
          required: ['nome', 'codigo', 'periodo', 'dataInicio', 'dataFim'],
          properties: {
            nome: { type: 'string' },
            codigo: { type: 'string' },
            periodo: {
              type: 'string',
              enum: ['matutino', 'vespertino', 'noturno', 'integral'],
            },
            capacidade: { type: 'number' },
            dataInicio: { type: 'string' },
            dataFim: { type: 'string' },
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
        tags: ['Turmas'],
        summary: 'Atualizar turma',
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
            periodo: {
              type: 'string',
              enum: ['matutino', 'vespertino', 'noturno', 'integral'],
            },
            capacidade: { type: 'number' },
            status: {
              type: 'string',
              enum: ['ativa', 'concluida', 'cancelada'],
            },
            dataInicio: { type: 'string' },
            dataFim: { type: 'string' },
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
        tags: ['Turmas'],
        summary: 'Deletar turma',
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
