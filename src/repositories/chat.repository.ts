import { prisma } from '../lib/prisma';

export interface CriarMensagemInput {
	conteudo: string;
	remetenteId: string;
	sala: string;
}

export class ChatRepository {
	async criarMensagem(data: CriarMensagemInput) {
		return prisma.mensagem.create({
			data: {
				conteudo: data.conteudo,
				remetenteId: data.remetenteId,
				sala: data.sala,
			},
		});
	}

	async listarMensagensPorSala(sala: string, limite = 50) {
		const limiteAjustado = Math.min(Math.max(limite, 1), 200);

		const mensagens = await prisma.mensagem.findMany({
			where: { sala },
			orderBy: { criadoEm: 'desc' },
			take: limiteAjustado,
		});

		return mensagens.reverse();
	}
}
