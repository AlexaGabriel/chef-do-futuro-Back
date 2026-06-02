import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../types';

/**
 * Middleware de autenticação JWT
 */
export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    const token = AuthService.extractTokenFromHeader(authHeader);

    if (!token) {
      return reply.status(401).send({
        sucesso: false,
        erro: 'Token não fornecido',
      });
    }

    const payload = AuthService.verifyToken(token);

    if (!payload) {
      return reply.status(401).send({
        sucesso: false,
        erro: 'Token inválido ou expirado',
      });
    }

    // Adiciona o usuário à request
    (request as any).user = payload;
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return reply.status(401).send({
      sucesso: false,
      erro: 'Não autorizado',
    });
  }
}

/**
 * Middleware para verificar se o usuário é aluno
 */
export async function requireAluno(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await authMiddleware(request, reply);

  const user = (request as any).user;
  if (user && user.role !== UserRole.ALUNO) {
    return reply.status(403).send({
      sucesso: false,
      erro: 'Acesso negado: apenas alunos podem acessar este recurso',
    });
  }
}

/**
 * Middleware para verificar se o usuário é professor
 */
export async function requireProfessor(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await authMiddleware(request, reply);

  const user = (request as any).user;
  if (user && user.role !== UserRole.PROFESSOR) {
    return reply.status(403).send({
      sucesso: false,
      erro: 'Acesso negado: apenas professores podem acessar este recurso',
    });
  }
}

/**
 * Middleware para verificar se o usuário é coordenador
 */
export async function requireCoordenador(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await authMiddleware(request, reply);

  const user = (request as any).user;
  if (user && user.role !== UserRole.COORDENADOR) {
    return reply.status(403).send({
      sucesso: false,
      erro: 'Acesso negado: apenas coordenadores podem acessar este recurso',
    });
  }
}

/**
 * Middleware para verificar se o usuário é professor ou coordenador
 */
export async function requireProfessorOrCoordenador(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await authMiddleware(request, reply);

  const user = (request as any).user;
  if (user && user.role !== UserRole.PROFESSOR && user.role !== UserRole.COORDENADOR) {
    return reply.status(403).send({
      sucesso: false,
      erro: 'Acesso negado: apenas professores e coordenadores podem acessar este recurso',
    });
  }
}
