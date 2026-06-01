import { FastifyRequest, FastifyReply } from 'fastify';
import { CoordenadorRepository } from '../repositories/coordenador.repository';
import {
  CriarCoordenadorDTO,
  AtualizarCoordenadorDTO,
  QueryParams,
} from '../types';

const coordenadorRepo = new CoordenadorRepository();

export class CoordenadorController {
  async listar(
    req: FastifyRequest<{ Querystring: QueryParams }>,
    reply: FastifyReply
  ) {
    const coordenadores = await coordenadorRepo.listarTodos(req.query);
    return reply.code(200).send({
      sucesso: true,
      dados: coordenadores,
    });
  }

  async buscarPorId(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const coordenador = await coordenadorRepo.buscarPorId(req.params.id);

    if (!coordenador) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Coordenador não encontrado',
      });
    }

    return reply.code(200).send({
      sucesso: true,
      dados: coordenador,
    });
  }

  async criar(
    req: FastifyRequest<{ Body: CriarCoordenadorDTO }>,
    reply: FastifyReply
  ) {
    const { email, cpf } = req.body;

    if (await coordenadorRepo.buscarPorEmail(email)) {
      return reply.code(400).send({
        sucesso: false,
        erro: 'Email já cadastrado',
      });
    }

    if (await coordenadorRepo.buscarPorCpf(cpf)) {
      return reply.code(400).send({
        sucesso: false,
        erro: 'CPF já cadastrado',
      });
    }

    const novoCoordenador = await coordenadorRepo.criar(req.body);

    return reply.code(201).send({
      sucesso: true,
      dados: novoCoordenador,
      mensagem: 'Coordenador criado com sucesso',
    });
  }

  async atualizar(
    req: FastifyRequest<{
      Params: { id: string };
      Body: AtualizarCoordenadorDTO;
    }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;
    const dto = req.body;

    if (!(await coordenadorRepo.buscarPorId(id))) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Coordenador não encontrado',
      });
    }

    if (dto.email) {
      const coordenadorComEmail = await coordenadorRepo.buscarPorEmail(dto.email);
      if (coordenadorComEmail && coordenadorComEmail.id !== id) {
        return reply.code(400).send({
          sucesso: false,
          erro: 'Email já cadastrado',
        });
      }
    }

    const coordenadorAtualizado = await coordenadorRepo.atualizar(id, dto);

    return reply.code(200).send({
      sucesso: true,
      dados: coordenadorAtualizado,
      mensagem: 'Coordenador atualizado com sucesso',
    });
  }

  async deletar(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = req.params;

    if (!(await coordenadorRepo.buscarPorId(id))) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Coordenador não encontrado',
      });
    }

    await coordenadorRepo.deletar(id);

    return reply.code(200).send({
      sucesso: true,
      mensagem: 'Coordenador deletado com sucesso',
    });
  }
}
