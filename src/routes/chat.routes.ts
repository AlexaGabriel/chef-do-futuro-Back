import { FastifyInstance } from 'fastify';
import { ChatController } from '../controllers/chat.controller';

const controller = new ChatController();

export async function chatRoutes(app: FastifyInstance) {
  app.get(
    '/:sala/historico',
    {
      schema: {
        tags: ['Chat'],
        summary: 'Listar histórico de mensagens de uma sala',
        params: {
          type: 'object',
          properties: { sala: { type: 'string' } },
          required: ['sala'],
        },
        querystring: {
          type: 'object',
          properties: { limite: { type: 'number' } },
        },
      },
    },
    (req, reply) => controller.listarHistorico(req as any, reply)
  );

  app.post(
    '/mensagem',
    {
      schema: {
        tags: ['Chat'],
        summary: 'Enviar mensagem via HTTP',
        body: {
          type: 'object',
          required: ['conteudo', 'remetenteId', 'sala'],
          properties: {
            conteudo: { type: 'string' },
            remetenteId: { type: 'string' },
            sala: { type: 'string' },
          },
        },
      },
    },
    (req, reply) => controller.enviarMensagemHttp(req as any, reply)
  );
}