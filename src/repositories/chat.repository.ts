import { prisma } from '../lib/prisma';

export interface CriarMensagemInput {
	conteudo: string;
	remetenteId: string;
	sala: string;
}

interface Remetente {
	id: string;
	nome: string;
}

type MensagemComRemetente = Awaited<ReturnType<typeof prisma.mensagem.create>> & {
	remetente: Remetente | null;
};

export class ChatRepository {
	async criarMensagem(data: CriarMensagemInput): Promise<MensagemComRemetente> {
		const mensagem = await prisma.mensagem.create({
			data: {
				conteudo: data.conteudo,
				remetenteId: data.remetenteId,
				sala: data.sala,
			},
		});

		const remetente = await this.buscarRemetente(data.remetenteId);

		return { ...mensagem, remetente };
	}

	async listarMensagensPorSala(sala: string, limite = 50): Promise<MensagemComRemetente[]> {
		const limiteAjustado = Math.min(Math.max(limite, 1), 200);

		const mensagens = await prisma.mensagem.findMany({
			where: { sala },
			orderBy: { criadoEm: 'desc' },
			take: limiteAjustado,
		});

		const mensagensComRemetente = await this.resolverRemetentes(mensagens);

		return mensagensComRemetente.reverse();
	}

	private async buscarRemetente(id: string): Promise<Remetente | null> {
		let usuario: { id: string; nome: string } | null = null;

		usuario = await prisma.aluno.findUnique({ where: { id }, select: { id: true, nome: true } });
		if (usuario) return usuario;

		usuario = await prisma.professor.findUnique({ where: { id }, select: { id: true, nome: true } });
		if (usuario) return usuario;

		usuario = await prisma.coordenador.findUnique({ where: { id }, select: { id: true, nome: true } });
		return usuario;
	}

	private async resolverRemetentes(mensagens: Array<{ id: string; conteudo: string; remetenteId: string; sala: string; criadoEm: Date }>) {
		const idsUnicos = [...new Set(mensagens.map((m) => m.remetenteId))];

		const [alunos, professores, coordenadores] = await Promise.all([
			prisma.aluno.findMany({ where: { id: { in: idsUnicos } }, select: { id: true, nome: true } }),
			prisma.professor.findMany({ where: { id: { in: idsUnicos } }, select: { id: true, nome: true } }),
			prisma.coordenador.findMany({ where: { id: { in: idsUnicos } }, select: { id: true, nome: true } }),
		]);

		const mapa = new Map<string, Remetente>();
		for (const u of alunos) mapa.set(u.id, u);
		for (const u of professores) mapa.set(u.id, u);
		for (const u of coordenadores) mapa.set(u.id, u);

		return mensagens.map((m) => ({ ...m, remetente: mapa.get(m.remetenteId) ?? null }));
	}
}
