import { FastifyInstance } from 'fastify';
import { CoordenadorController } from '../controllers/coordenador.controller';

const controller = new CoordenadorController();

export async function coordenadorRoutes(app: FastifyInstance) {

  app.get(
    '/',
    {
      schema: {
        tags: ['Coordenadores'],
        summary: 'Listar todos os coordenadores',
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
        tags: ['Coordenadores'],
        summary: 'Buscar coordenador por ID',
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
        tags: ['Coordenadores'],
        summary: 'Criar novo coordenador',
        body: {
          type: 'object',
          required: [
            'nome',
            'email',
            'telefone',
            'cpf',
            'departamento',
            'permissoes',
          ],
          properties: {
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            telefone: { type: 'string' },
            cpf: { type: 'string' },
            departamento: { type: 'string' },
            permissoes: {
              type: 'array',
              items: {
                type: 'string',
                enum: [
                  'gerenciar_alunos',
                  'gerenciar_professores',
                  'gerenciar_turmas',
                  'gerenciar_disciplinas',
                  'emitir_relatorios',
                  'gerenciar_financeiro',
                ],
              },
            },
            ramal: { type: 'string' },
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
        tags: ['Coordenadores'],
        summary: 'Atualizar coordenador',
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
            departamento: { type: 'string' },
            permissoes: {
              type: 'array',
              items: {
                type: 'string',
                enum: [
                  'gerenciar_alunos',
                  'gerenciar_professores',
                  'gerenciar_turmas',
                  'gerenciar_disciplinas',
                  'emitir_relatorios',
                  'gerenciar_financeiro',
                ],
              },
            },
            ramal: { type: 'string' },
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
        tags: ['Coordenadores'],
        summary: 'Deletar coordenador',
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
