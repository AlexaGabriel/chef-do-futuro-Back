import { prisma } from '../lib/prisma';

function gerarMatricula(): string {
  const ano = new Date().getFullYear();
  const numero = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, '0');
  return `ALU${ano}${numero}`;
}

function gerarRegistro(tipo: 'PROF' | 'COORD'): string {
  const ano = new Date().getFullYear();
  const numero = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, '0');
  return `${tipo}${ano}${numero}`;
}

export async function seedDatabase(): Promise<void> {
  try {
    const alunosCount = await prisma.aluno.count();
    if (alunosCount > 0) {
      console.log('✅ Database já populado, pulando seed...');
      return;
    }

    const professor1 = await prisma.professor.create({
      data: {
        nome: 'Chef Carlos Mendes',
        email: 'carlos.mendes@escola.com',
        telefone: '(11) 3456-7890',
        cpf: '456.789.012-33',
        registro: gerarRegistro('PROF'),
        role: 'professor',
        status: 'ativo',
        especialidades: JSON.stringify(['Culinária Italiana', 'Massas Artesanais']),
        disciplinas: JSON.stringify([]),
        bio: 'Chef com 15 anos de experiência em restaurantes estrelados',
        cargaHoraria: 40,
      },
    });

    const professor2 = await prisma.professor.create({
      data: {
        nome: 'Chef Patricia Oliveira',
        email: 'patricia.oliveira@escola.com',
        telefone: '(11) 3456-7891',
        cpf: '567.890.123-44',
        registro: gerarRegistro('PROF'),
        role: 'professor',
        status: 'ativo',
        especialidades: JSON.stringify(['Confeitaria', 'Chocolateria']),
        disciplinas: JSON.stringify([]),
        bio: 'Especialista em doces finos e confeitaria francesa',
        cargaHoraria: 30,
      },
    });

    const professor3 = await prisma.professor.create({
      data: {
        nome: 'Chef Roberto Alves',
        email: 'roberto.alves@escola.com',
        telefone: '(21) 3456-7892',
        cpf: '678.901.234-55',
        registro: gerarRegistro('PROF'),
        role: 'professor',
        status: 'ativo',
        especialidades: JSON.stringify(['Gastronomia Contemporânea', 'Técnicas Moleculares']),
        disciplinas: JSON.stringify([]),
        cargaHoraria: 35,
      },
    });

    await prisma.aluno.createMany({
      data: [
        {
          nome: 'Maria Silva',
          email: 'maria.silva@email.com',
          telefone: '(11) 98765-4321',
          dataNascimento: '1995-05-15',
          cpf: '123.456.789-00',
          matricula: gerarMatricula(),
          role: 'aluno',
          status: 'ativo',
          nivelCulinaria: 'iniciante',
          turmas: JSON.stringify([]),
          observacoes: 'Interesse em confeitaria',
        },
        {
          nome: 'João Santos',
          email: 'joao.santos@email.com',
          telefone: '(11) 97654-3210',
          dataNascimento: '1998-08-22',
          cpf: '234.567.890-11',
          matricula: gerarMatricula(),
          role: 'aluno',
          status: 'ativo',
          nivelCulinaria: 'intermediario',
          turmas: JSON.stringify([]),
        },
        {
          nome: 'Ana Costa',
          email: 'ana.costa@email.com',
          telefone: '(21) 99876-5432',
          dataNascimento: '2000-03-10',
          cpf: '345.678.901-22',
          matricula: gerarMatricula(),
          role: 'aluno',
          status: 'ativo',
          nivelCulinaria: 'avancado',
          turmas: JSON.stringify([]),
          observacoes: 'Experiência em gastronomia francesa',
        },
      ],
    });

    await prisma.coordenador.createMany({
      data: [
        {
          nome: 'Fernanda Lima',
          email: 'fernanda.lima@escola.com',
          telefone: '(11) 3456-7800',
          cpf: '789.012.345-66',
          registro: gerarRegistro('COORD'),
          role: 'coordenador',
          status: 'ativo',
          departamento: 'Acadêmico',
          permissoes: JSON.stringify([
            'gerenciar_alunos',
            'gerenciar_professores',
            'gerenciar_turmas',
            'gerenciar_disciplinas',
          ]),
          ramal: '1001',
        },
        {
          nome: 'Ricardo Pereira',
          email: 'ricardo.pereira@escola.com',
          telefone: '(11) 3456-7801',
          cpf: '890.123.456-77',
          registro: gerarRegistro('COORD'),
          role: 'coordenador',
          status: 'ativo',
          departamento: 'Administrativo',
          permissoes: JSON.stringify(['emitir_relatorios', 'gerenciar_financeiro']),
          ramal: '1002',
        },
      ],
    });

    await prisma.curso.createMany({
      data: [
        {
          titulo: 'Massa Caseira',
          descricao: 'Aprenda a fazer massas caseiras deliciosas do zero',
          imagemUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb',
          nivel: 'iniciante',
          status: 'publicado',
          duracao: 20,
          professorId: professor1.id,
          categoria: 'Massas',
          tags: JSON.stringify(['massa', 'italiano', 'iniciante']),
          quantidadeAlunos: 45,
          secoes: JSON.stringify([
            {
              id: '1',
              titulo: 'Boas-vindas',
              ordem: 1,
              licoes: [{ id: '1-1', titulo: 'Introdução à Massa Caseira', duracao: 10, ordem: 1 }],
            },
          ]),
        },
        {
          titulo: 'Sushi',
          descricao: 'Técnicas autênticas de preparação de sushi japonês',
          imagemUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
          nivel: 'intermediario',
          status: 'publicado',
          duracao: 30,
          professorId: professor3.id,
          categoria: 'Culinária Japonesa',
          tags: JSON.stringify(['sushi', 'japonês', 'peixe']),
          quantidadeAlunos: 32,
          secoes: JSON.stringify([]),
        },
        {
          titulo: 'Tacos',
          descricao: 'Descubra os sabores autênticos da culinária mexicana',
          imagemUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
          nivel: 'iniciante',
          status: 'publicado',
          duracao: 15,
          professorId: professor1.id,
          categoria: 'Culinária Mexicana',
          tags: JSON.stringify(['tacos', 'mexicano', 'temperos']),
          quantidadeAlunos: 28,
          secoes: JSON.stringify([]),
        },
        {
          titulo: 'Macarons',
          descricao: 'Domine a arte dos macarons franceses perfeitos',
          imagemUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43',
          nivel: 'avancado',
          status: 'publicado',
          duracao: 25,
          professorId: professor2.id,
          categoria: 'Confeitaria',
          tags: JSON.stringify(['macarons', 'francês', 'confeitaria']),
          quantidadeAlunos: 18,
          secoes: JSON.stringify([]),
        },
        {
          titulo: 'Frango Assado',
          descricao: 'Técnicas profissionais para o frango assado perfeito',
          imagemUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6',
          nivel: 'intermediario',
          status: 'publicado',
          duracao: 18,
          professorId: professor3.id,
          categoria: 'Aves',
          tags: JSON.stringify(['frango', 'assados', 'carnes']),
          quantidadeAlunos: 52,
          secoes: JSON.stringify([]),
        },
        {
          titulo: 'Pão Artesanal',
          descricao: 'Do fermento natural ao pão crocante perfeito',
          imagemUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
          nivel: 'intermediario',
          status: 'publicado',
          duracao: 35,
          professorId: professor1.id,
          categoria: 'Panificação',
          tags: JSON.stringify(['pão', 'fermento', 'artesanal']),
          quantidadeAlunos: 67,
          secoes: JSON.stringify([]),
        },
      ],
    });

    const stats = {
      alunos: await prisma.aluno.count(),
      professores: await prisma.professor.count(),
      coordenadores: await prisma.coordenador.count(),
      cursos: await prisma.curso.count(),
    };

    console.log('✅ Database populado com sucesso!');
    console.log(`   - ${stats.alunos} alunos`);
    console.log(`   - ${stats.professores} professores`);
    console.log(`   - ${stats.coordenadores} coordenadores`);
    console.log(`   - ${stats.cursos} cursos`);
  } catch (error) {
    console.error('❌ Erro ao popular database:', error);
    throw error;
  }
}

export async function clearDatabase(): Promise<void> {
  await prisma.curso.deleteMany();
  await prisma.aluno.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.coordenador.deleteMany();
  console.log('🗑️  Database limpo');
}
