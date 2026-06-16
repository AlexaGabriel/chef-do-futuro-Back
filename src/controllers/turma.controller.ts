import { FastifyRequest, FastifyReply } from 'fastify';
import { TurmaRepository } from '../repositories/turma.repository';
import { CriarTurmaDTO, AtualizarTurmaDTO } from '../types';

const turmaRepo = new TurmaRepository();

export class TurmaController {
  async listar(
    req: FastifyRequest<{ Params: { cursoId: string } }>,
    reply: FastifyReply
  ) {
    const turmas = await turmaRepo.listarPorCurso(req.params.cursoId);

    return reply.code(200).send({
      sucesso: true,
      dados: turmas,
    });
  }

  async buscarPorId(
    req: FastifyRequest<{ Params: { cursoId: string; id: string } }>,
    reply: FastifyReply
  ) {
    const turma = await turmaRepo.buscarPorId(req.params.id);

    if (!turma) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Turma não encontrada',
      });
    }

    if (turma.cursoId !== req.params.cursoId) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Turma não pertence a este curso',
      });
    }

    return reply.code(200).send({
      sucesso: true,
      dados: turma,
    });
  }

  async criar(
    req: FastifyRequest<{ Params: { cursoId: string }; Body: CriarTurmaDTO }>,
    reply: FastifyReply
  ) {
    const turma = await turmaRepo.criar(req.params.cursoId, req.body);

    if (!turma) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Curso não encontrado',
      });
    }

    return reply.code(201).send({
      sucesso: true,
      dados: turma,
      mensagem: 'Turma criada com sucesso',
    });
  }

  async atualizar(
    req: FastifyRequest<{ Params: { cursoId: string; id: string }; Body: AtualizarTurmaDTO }>,
    reply: FastifyReply
  ) {
    const { cursoId, id } = req.params;

    if (!(await turmaRepo.verificarPertenceAoCurso(id, cursoId))) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Turma não encontrada neste curso',
      });
    }

    const turma = await turmaRepo.atualizar(id, req.body);

    return reply.code(200).send({
      sucesso: true,
      dados: turma,
      mensagem: 'Turma atualizada com sucesso',
    });
  }

  async deletar(
    req: FastifyRequest<{ Params: { cursoId: string; id: string } }>,
    reply: FastifyReply
  ) {
    const { cursoId, id } = req.params;

    if (!(await turmaRepo.verificarPertenceAoCurso(id, cursoId))) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Turma não encontrada neste curso',
      });
    }

    await turmaRepo.deletar(id);

    return reply.code(200).send({
      sucesso: true,
      mensagem: 'Turma deletada com sucesso',
    });
  }
}
