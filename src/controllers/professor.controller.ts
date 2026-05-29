import { FastifyRequest, FastifyReply } from 'fastify';
import { ProfessorRepository } from '../repositories/professor.repository';
import {
  CriarProfessorDTO,
  AtualizarProfessorDTO,
  QueryParams,
} from '../types';

const professorRepo = new ProfessorRepository();

export class ProfessorController {
  async listar(
    req: FastifyRequest<{ Querystring: QueryParams }>,
    reply: FastifyReply
  ) {
    const professores = professorRepo.listarTodos(req.query);
    return reply.code(200).send({
      sucesso: true,
      dados: professores,
    });
  }

  async buscarPorId(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const professor = professorRepo.buscarPorId(req.params.id);

    if (!professor) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Professor não encontrado',
      });
    }

    return reply.code(200).send({
      sucesso: true,
      dados: professor,
    });
  }

  async criar(
    req: FastifyRequest<{ Body: CriarProfessorDTO }>,
    reply: FastifyReply
  ) {
    const { email, cpf } = req.body;

    if (professorRepo.buscarPorEmail(email)) {
      return reply.code(400).send({
        sucesso: false,
        erro: 'Email já cadastrado',
      });
    }

    if (professorRepo.buscarPorCpf(cpf)) {
      return reply.code(400).send({
        sucesso: false,
        erro: 'CPF já cadastrado',
      });
    }

    const novoProfessor = professorRepo.criar(req.body);

    return reply.code(201).send({
      sucesso: true,
      dados: novoProfessor,
      mensagem: 'Professor criado com sucesso',
    });
  }

  async atualizar(
    req: FastifyRequest<{
      Params: { id: string };
      Body: AtualizarProfessorDTO;
    }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;
    const dto = req.body;

    if (!professorRepo.buscarPorId(id)) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Professor não encontrado',
      });
    }

    if (dto.email) {
      const professorComEmail = professorRepo.buscarPorEmail(dto.email);
      if (professorComEmail && professorComEmail.id !== id) {
        return reply.code(400).send({
          sucesso: false,
          erro: 'Email já cadastrado',
        });
      }
    }

    const professorAtualizado = professorRepo.atualizar(id, dto);

    return reply.code(200).send({
      sucesso: true,
      dados: professorAtualizado,
      mensagem: 'Professor atualizado com sucesso',
    });
  }

  async deletar(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;

    if (!professorRepo.buscarPorId(id)) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Professor não encontrado',
      });
    }

    professorRepo.deletar(id);

    return reply.code(200).send({
      sucesso: true,
      mensagem: 'Professor deletado com sucesso',
    });
  }
}
