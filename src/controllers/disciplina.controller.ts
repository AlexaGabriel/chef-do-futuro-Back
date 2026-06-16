import { FastifyRequest, FastifyReply } from 'fastify';
import { DisciplinaRepository } from '../repositories/disciplina.repository';
import { CriarDisciplinaDTO, AtualizarDisciplinaDTO } from '../types';

const disciplinaRepo = new DisciplinaRepository();

export class DisciplinaController {
  async listar(
    req: FastifyRequest<{ Params: { cursoId: string } }>,
    reply: FastifyReply
  ) {
    const disciplinas = await disciplinaRepo.listarPorCurso(req.params.cursoId);

    return reply.code(200).send({
      sucesso: true,
      dados: disciplinas,
    });
  }

  async buscarPorId(
    req: FastifyRequest<{ Params: { cursoId: string; id: string } }>,
    reply: FastifyReply
  ) {
    const disciplina = await disciplinaRepo.buscarPorId(req.params.id);

    if (!disciplina) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Disciplina não encontrada',
      });
    }

    if (disciplina.cursoId !== req.params.cursoId) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Disciplina não pertence a este curso',
      });
    }

    return reply.code(200).send({
      sucesso: true,
      dados: disciplina,
    });
  }

  async criar(
    req: FastifyRequest<{ Params: { cursoId: string }; Body: CriarDisciplinaDTO }>,
    reply: FastifyReply
  ) {
    const disciplina = await disciplinaRepo.criar(req.params.cursoId, req.body);

    if (!disciplina) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Curso não encontrado',
      });
    }

    return reply.code(201).send({
      sucesso: true,
      dados: disciplina,
      mensagem: 'Disciplina criada com sucesso',
    });
  }

  async atualizar(
    req: FastifyRequest<{ Params: { cursoId: string; id: string }; Body: AtualizarDisciplinaDTO }>,
    reply: FastifyReply
  ) {
    const { cursoId, id } = req.params;

    if (!(await disciplinaRepo.verificarPertenceAoCurso(id, cursoId))) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Disciplina não encontrada neste curso',
      });
    }

    const disciplina = await disciplinaRepo.atualizar(id, req.body);

    return reply.code(200).send({
      sucesso: true,
      dados: disciplina,
      mensagem: 'Disciplina atualizada com sucesso',
    });
  }

  async deletar(
    req: FastifyRequest<{ Params: { cursoId: string; id: string } }>,
    reply: FastifyReply
  ) {
    const { cursoId, id } = req.params;

    if (!(await disciplinaRepo.verificarPertenceAoCurso(id, cursoId))) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Disciplina não encontrada neste curso',
      });
    }

    await disciplinaRepo.deletar(id);

    return reply.code(200).send({
      sucesso: true,
      mensagem: 'Disciplina deletada com sucesso',
    });
  }
}
