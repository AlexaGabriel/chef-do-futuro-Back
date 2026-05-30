import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { alunoRoutes } from './routes/aluno.routes';
import { professorRoutes } from './routes/professor.routes';
import { coordenadorRoutes } from './routes/coordenador.routes';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          colorize: true,
        },
      },
    },
  });

  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Escola de Culinária — API',
        description:
          'API REST para gerenciamento de alunos, professores e coordenadores da escola de culinária.',
        version: '1.0.0',
      },
      tags: [
        { name: 'Alunos', description: 'Operações de cadastro de alunos' },
        { name: 'Professores', description: 'Operações de cadastro de professores' },
        { name: 'Coordenadores', description: 'Operações de cadastro de coordenadores' },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list', deepLinking: false },
  });


  app.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Health check da API, Micael, Richard, Caua, Gabriel e Alexandre',
        hide: true,
      },
    },
    async () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
      versao: '1.0.0',
    }),
  );

  app.register(alunoRoutes, { prefix: '/api/v1/alunos' });
  app.register(professorRoutes, { prefix: '/api/v1/professores' });
  app.register(coordenadorRoutes, { prefix: '/api/v1/coordenadores' });

  app.setNotFoundHandler((req: any, reply: any) => {
    reply.code(404).send({
      sucesso: false,
      erro: `Rota não encontrada: ${req.method} ${req.url}`,
    });
  });

  app.setErrorHandler((err: any, _req: any, reply: any) => {
    app.log.error(err);

    if (err.validation) {
      return reply.code(400).send({
        sucesso: false,
        erro: 'Dados inválidos.',
        detalhes: err.validation,
      });
    }

    return reply.code(err.statusCode ?? 500).send({
      sucesso: false,
      erro: err.message ?? 'Erro interno do servidor.',
    });
  });

  return app;
}
