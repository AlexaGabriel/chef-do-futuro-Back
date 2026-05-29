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
    const coordenadores = coordenadorRepo.listarTodos(req.query);
    return reply.code(200).send({
      sucesso: true,
      dados: coordenadores,
    });
  }

  async buscarPorId(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const coordenador = coordenadorRepo.buscarPorId(req.params.id);

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

    if (coordenadorRepo.buscarPorEmail(email)) {
      return reply.code(400).send({
        sucesso: false,
        erro: 'Email já cadastrado',
      });
    }

    if (coordenadorRepo.buscarPorCpf(cpf)) {
      return reply.code(400).send({
        sucesso: false,
        erro: 'CPF já cadastrado',
      });
    }

    const novoCoordenador = coordenadorRepo.criar(req.body);

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

    if (!coordenadorRepo.buscarPorId(id)) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Coordenador não encontrado',
      });
    }

    if (dto.email) {
      const coordenadorComEmail = coordenadorRepo.buscarPorEmail(dto.email);
      if (coordenadorComEmail && coordenadorComEmail.id !== id) {
        return reply.code(400).send({
          sucesso: false,
          erro: 'Email já cadastrado',
        });
      }
    }

    const coordenadorAtualizado = coordenadorRepo.atualizar(id, dto);

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

    if (!coordenadorRepo.buscarPorId(id)) {
      return reply.code(404).send({
        sucesso: false,
        erro: 'Coordenador não encontrado',
      });
    }

    coordenadorRepo.deletar(id);

    return reply.code(200).send({
      sucesso: true,
      mensagem: 'Coordenador deletado com sucesso',
    });
  }
}
