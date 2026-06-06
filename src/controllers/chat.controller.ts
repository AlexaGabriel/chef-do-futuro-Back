import { FastifyReply, FastifyRequest } from 'fastify';
import { Server, Socket } from 'socket.io';
import {
  ChatRepository,
  CriarMensagemInput,
} from '../repositories/chat.repository';

interface EnviarMensagemDTO {
  conteudo: string;
  remetenteId: string;
  sala: string;
}

interface HistoricoQuery {
  limite?: string;
}

interface SalaParams {
  sala: string;
}

type SocketAck = (response: {
  sucesso: boolean;
  dados?: unknown;
  erro?: string;
}) => void;

const chatRepo = new ChatRepository();

export class ChatController {
  async listarHistorico(
    req: FastifyRequest<{ Params: SalaParams; Querystring: HistoricoQuery }>,
    reply: FastifyReply
  ) {
    const { sala } = req.params;
    const limite = req.query.limite ? Number(req.query.limite) : 50;

    if (!sala?.trim()) {
      return reply.code(400).send({
        sucesso: false,
        erro: 'Sala é obrigatória',
      });
    }

    const historico = await chatRepo.listarMensagensPorSala(sala, limite);

    return reply.code(200).send({
      sucesso: true,
      dados: historico,
    });
  }

  async enviarMensagemHttp(
    req: FastifyRequest<{ Body: EnviarMensagemDTO }>,
    reply: FastifyReply
  ) {
    try {
      const mensagem = await this.persistirMensagem(req.body);

      return reply.code(201).send({
        sucesso: true,
        dados: mensagem,
        mensagem: 'Mensagem enviada com sucesso',
      });
    } catch (error) {
      return reply.code(400).send({
        sucesso: false,
        erro: error instanceof Error ? error.message : 'Erro ao enviar mensagem',
      });
    }
  }

  registrarEventosSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
      socket.on('chat:entrar-sala', (sala: string) => {
        if (!sala?.trim()) {
          socket.emit('chat:erro', { erro: 'Sala inválida' });
          return;
        }

        socket.join(sala);
        socket.emit('chat:sala-entrou', { sala });
      });

      socket.on(
        'chat:mensagem',
        async (payload: EnviarMensagemDTO, ack?: SocketAck) => {
          try {
            const mensagem = await this.persistirMensagem(payload);
            io.to(mensagem.sala).emit('chat:nova-mensagem', mensagem);
            ack?.({ sucesso: true, dados: mensagem });
          } catch (error) {
            const erro = error instanceof Error ? error.message : 'Erro ao enviar mensagem';
            ack?.({ sucesso: false, erro });
            socket.emit('chat:erro', { erro });
          }
        }
      );

      socket.on(
        'chat:historico',
        async (
          payload: { sala: string; limite?: number },
          ack?: SocketAck
        ) => {
          try {
            if (!payload?.sala?.trim()) {
              ack?.({ sucesso: false, erro: 'Sala é obrigatória' });
              return;
            }

            const historico = await chatRepo.listarMensagensPorSala(
              payload.sala,
              payload.limite ?? 50
            );

            ack?.({ sucesso: true, dados: historico });
          } catch {
            ack?.({ sucesso: false, erro: 'Erro ao buscar histórico' });
          }
        }
      );
    });
  }

  private async persistirMensagem(data: CriarMensagemInput) {
    if (!data?.conteudo?.trim()) {
      throw new Error('Conteúdo da mensagem é obrigatório');
    }

    if (!data?.remetenteId?.trim()) {
      throw new Error('remetenteId é obrigatório');
    }

    if (!data?.sala?.trim()) {
      throw new Error('Sala é obrigatória');
    }

    return chatRepo.criarMensagem({
      conteudo: data.conteudo.trim(),
      remetenteId: data.remetenteId,
      sala: data.sala,
    });
  }
}
