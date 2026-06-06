import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifySocketIO from 'fastify-socket.io';

import { alunoRoutes } from './routes/aluno.routes';
import { professorRoutes } from './routes/professor.routes';
import { coordenadorRoutes } from './routes/coordenador.routes';
import { cursoRoutes } from './routes/curso.routes';
import { authRoutes } from './routes/auth.routes';
import { chatRoutes } from './routes/chat.routes';
import { ChatController } from './controllers/chat.controller';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          colorize: true,
        },
      },
    },
  });

  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  await app.register(fastifySocketIO, {
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true
    },
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Escola de Culinária — API',
        description:
          'API REST para gerenciamento de alunos, professores e coordenadores da escola de culinária.',
        version: '1.0.0',
      },
      tags: [
        { name: 'Autenticação', description: 'Login de alunos, professores e coordenadores' },
        { name: 'Alunos', description: 'Operações de cadastro de alunos' },
        { name: 'Professores', description: 'Operações de cadastro de professores' },
        { name: 'Cursos', description: 'Operações de cadastro de cursos' },
        { name: 'Coordenadores', description: 'Operações de cadastro de coordenadores' },
        { name: 'Chat', description: 'Operações de chat' },
        { name: 'Health', description: 'Health check da API' },
      ],
    },
  });

  app.get('/teste-chat', { schema: { hide: true } }, (req, reply) => {
    const html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Teste Real Oficial - Chef do Futuro</title>
        <script src="https://cdn.socket.io/4.7.4/socket.io.min.js"></script>
        <style>
            body { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            input, button { padding: 10px; margin: 5px 0; width: 100%; box-sizing: border-box; }
            button { background: #ff4757; color: white; border: none; border-radius: 5px; cursor: pointer; }
            ul { background: #f1f2f6; padding: 20px; border-radius: 8px; min-height: 300px; list-style: none; }
            li { padding: 8px; border-bottom: 1px solid #ddd; }
        </style>
    </head>
    <body>
        <h2>🧪 Lab de Testes - Chat</h2>
        <div id="status" style="color: red; font-weight: bold; margin-bottom: 20px;">🟡 Conectando...</div>
        
        <div>
            <input id="sala" type="text" value="turma-top" placeholder="Qual a sala?">
            <button onclick="entrarSala()">1. Entrar na Sala</button>
        </div>

        <div style="margin-top: 20px;">
            <input id="nome" type="text" placeholder="Seu Apelido (ex: AlunoX)">
            <input id="msg" type="text" placeholder="Digite sua mensagem...">
            <button onclick="enviarMensagem()">2. Enviar Mensagem</button>
        </div>

        <ul id="mensagens"></ul>

        <script>
            // O io() vazio faz ele conectar automaticamente na URL onde a página está hospedada!
            const socket = io();

            socket.on("connect", () => {
                const statusInfo = document.getElementById("status");
                statusInfo.innerText = "🟢 Online! Seu ID: " + socket.id;
                statusInfo.style.color = "green";
            });

            socket.on("chat:nova-mensagem", (mensagem) => {
                const ul = document.getElementById("mensagens");
                const li = document.createElement("li");
                li.innerHTML = "<strong>" + mensagem.remetenteId + ":</strong> " + mensagem.conteudo;
                ul.appendChild(li);
            });

            function entrarSala() {
                const sala = document.getElementById("sala").value;
                socket.emit("chat:entrar-sala", sala);
                alert("Você entrou na sala: " + sala);
            }

            function enviarMensagem() {
                const conteudo = document.getElementById("msg").value;
                const sala = document.getElementById("sala").value;
                const nome = document.getElementById("nome").value || "Anônimo";
                
                socket.emit("chat:mensagem", {
                    conteudo: conteudo,
                    remetenteId: nome,
                    sala: sala
                });
                
                document.getElementById("msg").value = "";
            }
        </script>
    </body>
    </html>
    `;

    reply.type('text/html').send(html);
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list', deepLinking: false },
  });


  app.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Health check da API, Micael, Richard, Caua, Gabriel e Alexandre',
        hide: true,
      },
    },
    async () => ({
      status: 'De boa, espero as férias',
      timestamp: new Date().toISOString(),
      versao: '2.0.0',
    }),
  );

  app.register(authRoutes, { prefix: '/api/v1' });
  app.register(alunoRoutes, { prefix: '/api/v1/alunos' });
  app.register(professorRoutes, { prefix: '/api/v1/professores' });
  app.register(coordenadorRoutes, { prefix: '/api/v1/coordenadores' });
  app.register(cursoRoutes, { prefix: '/api/v1/cursos' });
  app.register(chatRoutes, { prefix: '/api/v1/chat' });

  app.ready((err) => {
    if (err) throw err;

    const chatController = new ChatController();
    chatController.registrarEventosSocket((app as any).io);
  })

  app.setNotFoundHandler((req: any, reply: any) => {
    reply.code(404).send({
      sucesso: false,
      erro: `Rota não encontrada: ${req.method} ${req.url}`,
    });
  });

  app.setErrorHandler((err: any, _req: any, reply: any) => {
    app.log.error(err);

    if (err.validation) {
      return reply.code(400).send({
        sucesso: false,
        erro: 'Dados inválidos.',
        detalhes: err.validation,
      });
    }

    return reply.code(err.statusCode ?? 500).send({
      sucesso: false,
      erro: err.message ?? 'Erro interno do servidor.',
    });
  });

  return app;
}
