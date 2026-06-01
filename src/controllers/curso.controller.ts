import { FastifyRequest, FastifyReply } from 'fastify';
import { CursoRepository } from '../repositories/curso.repository';
import {
  CriarCursoDTO,
  AtualizarCursoDTO,
  QueryParams,
} from '../types';

const cursoRepo = new CursoRepository();

export class CursoController {
  async listar(
    req: FastifyRequest<{ Querystring: QueryParams }>,
    reply: FastifyReply
  ) {
    const cursos = await cursoRepo.listarTodos(req.query);
    return reply.code(200).send({
      sucesso: true,
      dados: cursos,
    });
  }

  async buscarPorId(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const curso = await cursoRepo.buscarPorId(req.params.id);

    if (!curso) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Curso não encontrado',
      });
    }

    return reply.code(200).send({
      sucesso: true,
      dados: curso,
    });
  }

  async buscarPorProfessor(
    req: FastifyRequest<{ Params: { professorId: string } }>,
    reply: FastifyReply
  ) {
    const cursos = await cursoRepo.buscarPorProfessor(req.params.professorId);

    return reply.code(200).send({
      sucesso: true,
      dados: cursos,
    });
  }

  async buscarPorCategoria(
    req: FastifyRequest<{ Params: { categoria: string } }>,
    reply: FastifyReply
  ) {
    const cursos = await cursoRepo.buscarPorCategoria(req.params.categoria);

    return reply.code(200).send({
      sucesso: true,
      dados: cursos,
    });
  }

  async criar(
    req: FastifyRequest<{ Body: CriarCursoDTO }>,
    reply: FastifyReply
  ) {
    const novoCurso = await cursoRepo.criar(req.body);

    return reply.code(201).send({
      sucesso: true,
      dados: novoCurso,
      mensagem: 'Curso criado com sucesso',
    });
  }

  async atualizar(
    req: FastifyRequest<{ Params: { id: string }; Body: AtualizarCursoDTO }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;
    const dto = req.body;

    const exists = await cursoRepo.buscarPorId(id);
    if (!exists) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Curso não encontrado',
      });
    }

    const cursoAtualizado = await cursoRepo.atualizar(id, dto);

    return reply.code(200).send({
      sucesso: true,
      dados: cursoAtualizado,
      mensagem: 'Curso atualizado com sucesso',
    });
  }

  async deletar(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;

    const exists = await cursoRepo.buscarPorId(id);
    if (!exists) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Curso não encontrado',
      });
    }

    await cursoRepo.deletar(id);

    return reply.code(200).send({
      sucesso: true,
      mensagem: 'Curso deletado com sucesso',
    });
  }
}
