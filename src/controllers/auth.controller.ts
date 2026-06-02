import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { AuthService } from '../services/auth.service';
import { LoginDTO, LoginResponse, UserRole } from '../types';

export class AuthController {
  /**
   * Login de Aluno
   */
  async loginAluno(
    request: FastifyRequest<{ Body: LoginDTO }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { email, senha } = request.body;

      // Buscar aluno por email
      const aluno = await prisma.aluno.findUnique({
        where: { email },
      });

      if (!aluno) {
        return reply.status(401).send({
          sucesso: false,
          erro: 'Credenciais inválidas',
        });
      }

      // Verificar senha
      const senhaValida = await AuthService.comparePassword(senha, aluno.senha);

      if (!senhaValida) {
        return reply.status(401).send({
          sucesso: false,
          erro: 'Credenciais inválidas',
        });
      }

      // Verificar status
      if (aluno.status !== 'ativo') {
        return reply.status(403).send({
          sucesso: false,
          erro: 'Usuário inativo ou suspenso',
        });
      }

      // Gerar token
      const token = AuthService.generateToken({
        id: aluno.id,
        email: aluno.email,
        role: UserRole.ALUNO,
      });

      const response: LoginResponse = {
        sucesso: true,
        dados: {
          token,
          usuario: {
            id: aluno.id,
            nome: aluno.nome,
            email: aluno.email,
            role: UserRole.ALUNO,
          },
        },
        mensagem: 'Login realizado com sucesso',
      };

      return reply.status(200).send(response);
    } catch (error) {
      console.error('Erro no login de aluno:', error);
      return reply.status(500).send({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Login de Professor
   */
  async loginProfessor(
    request: FastifyRequest<{ Body: LoginDTO }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { email, senha } = request.body;

      // Buscar professor por email
      const professor = await prisma.professor.findUnique({
        where: { email },
      });

      if (!professor) {
        return reply.status(401).send({
          sucesso: false,
          erro: 'Credenciais inválidas',
        });
      }

      // Verificar senha
      const senhaValida = await AuthService.comparePassword(senha, professor.senha);

      if (!senhaValida) {
        return reply.status(401).send({
          sucesso: false,
          erro: 'Credenciais inválidas',
        });
      }

      // Verificar status
      if (professor.status !== 'ativo') {
        return reply.status(403).send({
          sucesso: false,
          erro: 'Usuário inativo ou suspenso',
        });
      }

      // Gerar token
      const token = AuthService.generateToken({
        id: professor.id,
        email: professor.email,
        role: UserRole.PROFESSOR,
      });

      const response: LoginResponse = {
        sucesso: true,
        dados: {
          token,
          usuario: {
            id: professor.id,
            nome: professor.nome,
            email: professor.email,
            role: UserRole.PROFESSOR,
          },
        },
        mensagem: 'Login realizado com sucesso',
      };

      return reply.status(200).send(response);
    } catch (error) {
      console.error('Erro no login de professor:', error);
      return reply.status(500).send({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Login de Coordenador
   */
  async loginCoordenador(
    request: FastifyRequest<{ Body: LoginDTO }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { email, senha } = request.body;

      // Buscar coordenador por email
      const coordenador = await prisma.coordenador.findUnique({
        where: { email },
      });

      if (!coordenador) {
        return reply.status(401).send({
          sucesso: false,
          erro: 'Credenciais inválidas',
        });
      }

      // Verificar senha
      const senhaValida = await AuthService.comparePassword(senha, coordenador.senha);

      if (!senhaValida) {
        return reply.status(401).send({
          sucesso: false,
          erro: 'Credenciais inválidas',
        });
      }

      // Verificar status
      if (coordenador.status !== 'ativo') {
        return reply.status(403).send({
          sucesso: false,
          erro: 'Usuário inativo ou suspenso',
        });
      }

      // Gerar token
      const token = AuthService.generateToken({
        id: coordenador.id,
        email: coordenador.email,
        role: UserRole.COORDENADOR,
      });

      const response: LoginResponse = {
        sucesso: true,
        dados: {
          token,
          usuario: {
            id: coordenador.id,
            nome: coordenador.nome,
            email: coordenador.email,
            role: UserRole.COORDENADOR,
          },
        },
        mensagem: 'Login realizado com sucesso',
      };

      return reply.status(200).send(response);
    } catch (error) {
      console.error('Erro no login de coordenador:', error);
      return reply.status(500).send({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }
}
