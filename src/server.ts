import { buildApp } from './app';
import { seedDatabase } from './db';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    await seedDatabase();
    const app = await buildApp();
    await app.listen({ port: PORT, host: HOST });

    console.log('\n🚀 Servidor rodando!');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📚 Documentação: http://localhost:${PORT}/docs`);
    console.log(`💚 Health: http://localhost:${PORT}/health\n`);
  } catch (err) {
    console.error('❌ Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\n👋 Encerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n👋 Encerrando servidor...');
  process.exit(0);
});

start();
