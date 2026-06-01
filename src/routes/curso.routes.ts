import { FastifyInstance } from 'fastify';
import { CursoController } from '../controllers/curso.controller';

const controller = new CursoController();

export async function cursoRoutes(app: FastifyInstance) {

  app.get(
    '/',
    {
      schema: {
        tags: ['Cursos'],
        summary: 'Listar todos os cursos',
        querystring: {
          type: 'object',
          properties: {
            pagina: { type: 'number' },
            limite: { type: 'number' },
            busca: { type: 'string' },
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
        tags: ['Cursos'],
        summary: 'Buscar curso por ID',
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


  app.get(
    '/professor/:professorId',
    {
      schema: {
        tags: ['Cursos'],
        summary: 'Buscar cursos por professor',
        params: {
          type: 'object',
          properties: {
            professorId: { type: 'string' },
          },
          required: ['professorId'],
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
    controller.buscarPorProfessor
  );


  app.get(
    '/categoria/:categoria',
    {
      schema: {
        tags: ['Cursos'],
        summary: 'Buscar cursos por categoria',
        params: {
          type: 'object',
          properties: {
            categoria: { type: 'string' },
          },
          required: ['categoria'],
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
    controller.buscarPorCategoria
  );


  app.post(
    '/',
    {
      schema: {
        tags: ['Cursos'],
        summary: 'Criar novo curso',
        body: {
          type: 'object',
          required: [
            'titulo',
            'descricao',
            'imagemUrl',
            'nivel',
            'duracao',
            'professorId',
            'categoria',
          ],
          properties: {
            titulo: { type: 'string' },
            descricao: { type: 'string' },
            imagemUrl: { type: 'string' },
            nivel: {
              type: 'string',
              enum: ['iniciante', 'intermediario', 'avancado'],
            },
            duracao: { type: 'number' },
            professorId: { type: 'string' },
            categoria: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            secoes: { type: 'array' },
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
        },
      },
    },
    controller.criar
  );


  app.patch(
    '/:id',
    {
      schema: {
        tags: ['Cursos'],
        summary: 'Atualizar curso',
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
            titulo: { type: 'string' },
            descricao: { type: 'string' },
            imagemUrl: { type: 'string' },
            nivel: {
              type: 'string',
              enum: ['iniciante', 'intermediario', 'avancado'],
            },
            status: {
              type: 'string',
              enum: ['rascunho', 'publicado', 'arquivado'],
            },
            duracao: { type: 'number' },
            professorId: { type: 'string' },
            categoria: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            secoes: { type: 'array' },
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
        tags: ['Cursos'],
        summary: 'Deletar curso',
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
