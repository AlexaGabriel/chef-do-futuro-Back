import { FastifyRequest, FastifyReply } from 'fastify';
import { AlunoRepository } from '../repositories/aluno.repository';
import {
  CriarAlunoDTO,
  AtualizarAlunoDTO,
  QueryParams,
} from '../types';

const alunoRepo = new AlunoRepository();

export class AlunoController {
  async listar(
    req: FastifyRequest<{ Querystring: QueryParams }>,
    reply: FastifyReply
  ) {
    const alunos = alunoRepo.listarTodos(req.query);
    return reply.code(200).send({
      sucesso: true,
      dados: alunos,
    });
  }

  async buscarPorId(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const aluno = alunoRepo.buscarPorId(req.params.id);

    if (!aluno) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Aluno não encontrado',
      });
    }

    return reply.code(200).send({
      sucesso: true,
      dados: aluno,
    });
  }

  async criar(
    req: FastifyRequest<{ Body: CriarAlunoDTO }>,
    reply: FastifyReply
  ) {
    const { email, cpf } = req.body;

    if (alunoRepo.buscarPorEmail(email)) {
      return reply.code(400).send({
        sucesso: false,
        erro: 'Email já cadastrado',
      });
    }

    if (alunoRepo.buscarPorCpf(cpf)) {
      return reply.code(400).send({
        sucesso: false,
        erro: 'CPF já cadastrado',
      });
    }

    const novoAluno = alunoRepo.criar(req.body);

    return reply.code(201).send({
      sucesso: true,
      dados: novoAluno,
      mensagem: 'Aluno criado com sucesso',
    });
  }

  async atualizar(
    req: FastifyRequest<{ Params: { id: string }; Body: AtualizarAlunoDTO }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;
    const dto = req.body;

    if (!alunoRepo.buscarPorId(id)) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Aluno não encontrado',
      });
    }

    if (dto.email) {
      const alunoComEmail = alunoRepo.buscarPorEmail(dto.email);
      if (alunoComEmail && alunoComEmail.id !== id) {
        return reply.code(400).send({
          sucesso: false,
          erro: 'Email já cadastrado',
        });
      }
    }

    const alunoAtualizado = alunoRepo.atualizar(id, dto);

    return reply.code(200).send({
      sucesso: true,
      dados: alunoAtualizado,
      mensagem: 'Aluno atualizado com sucesso',
    });
  }

  async deletar(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;

    if (!alunoRepo.buscarPorId(id)) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Aluno não encontrado',
      });
    }

    alunoRepo.deletar(id);

    return reply.code(200).send({
      sucesso: true,
      mensagem: 'Aluno deletado com sucesso',
    });
  }
}
