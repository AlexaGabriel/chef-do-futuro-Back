import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';

export async function authRoutes(app: FastifyInstance) {
  const authController = new AuthController();

  // Login de Aluno
  app.post(
    '/auth/aluno/login',
    {
      schema: {
        tags: ['Autenticação'],
        description: 'Login de aluno',
        body: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', format: 'email' },
            senha: { type: 'string', minLength: 6 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              dados: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  usuario: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      nome: { type: 'string' },
                      email: { type: 'string' },
                      role: { type: 'string' },
                    },
                  },
                },
              },
              mensagem: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              erro: { type: 'string' },
            },
          },
        },
      },
    },
    authController.loginAluno.bind(authController)
  );

  // Login de Professor
  app.post(
    '/auth/professor/login',
    {
      schema: {
        tags: ['Autenticação'],
        description: 'Login de professor',
        body: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', format: 'email' },
            senha: { type: 'string', minLength: 6 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              dados: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  usuario: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      nome: { type: 'string' },
                      email: { type: 'string' },
                      role: { type: 'string' },
                    },
                  },
                },
              },
              mensagem: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              erro: { type: 'string' },
            },
          },
        },
      },
    },
    authController.loginProfessor.bind(authController)
  );

  // Login de Coordenador
  app.post(
    '/auth/coordenador/login',
    {
      schema: {
        tags: ['Autenticação'],
        description: 'Login de coordenador',
        body: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', format: 'email' },
            senha: { type: 'string', minLength: 6 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              dados: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  usuario: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      nome: { type: 'string' },
                      email: { type: 'string' },
                      role: { type: 'string' },
                    },
                  },
                },
              },
              mensagem: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              sucesso: { type: 'boolean' },
              erro: { type: 'string' },
            },
          },
        },
      },
    },
    authController.loginCoordenador.bind(authController)
  );
}
