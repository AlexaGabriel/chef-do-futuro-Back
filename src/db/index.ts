import { prisma } from '../lib/prisma';
import { AuthService } from '../services/auth.service';

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

    const senhaHash = await AuthService.hashPassword('senha123');

    const professor1 = await prisma.professor.create({
      data: {
        nome: 'Chef Carlos Mendes',
        email: 'carlos.mendes@escola.com',
        senha: senhaHash,
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
        senha: senhaHash,
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
        senha: senhaHash,
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
          senha: senhaHash,
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
          senha: senhaHash,
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
          senha: senhaHash,
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
          senha: senhaHash,
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
          senha: senhaHash,
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

    const massaCaseira = (await prisma.curso.findFirst({ where: { titulo: 'Massa Caseira' } }))!;
    const sushi = (await prisma.curso.findFirst({ where: { titulo: 'Sushi' } }))!;
    const paoArtesanal = (await prisma.curso.findFirst({ where: { titulo: 'Pão Artesanal' } }))!;

    await prisma.turma.createMany({
      data: [
        {
          nome: 'Turma A - Massas',
          codigo: 'TUR-MASSA-2024A',
          cursoId: massaCaseira.id,
          periodo: 'matutino',
          capacidade: 25,
          status: 'ativa',
          dataInicio: '2024-02-01',
          dataFim: '2024-06-30',
        },
        {
          nome: 'Turma B - Massas',
          codigo: 'TUR-MASSA-2024B',
          cursoId: massaCaseira.id,
          periodo: 'noturno',
          capacidade: 20,
          status: 'ativa',
          dataInicio: '2024-03-15',
          dataFim: '2024-08-15',
        },
        {
          nome: 'Turma A - Sushi',
          codigo: 'TUR-SUSHI-2024A',
          cursoId: sushi.id,
          periodo: 'vespertino',
          capacidade: 15,
          status: 'ativa',
          dataInicio: '2024-04-01',
          dataFim: '2024-09-30',
        },
        {
          nome: 'Turma A - Pães',
          codigo: 'TUR-PAO-2024A',
          cursoId: paoArtesanal.id,
          periodo: 'integral',
          capacidade: 20,
          status: 'ativa',
          dataInicio: '2024-05-01',
          dataFim: '2024-11-30',
        },
      ],
    });

    await prisma.disciplina.createMany({
      data: [
        {
          nome: 'Fundamentos da Massa',
          codigo: 'DISC-MASSA-001',
          cursoId: massaCaseira.id,
          cargaHoraria: 40,
          ementa: 'Tipos de farinha, técnicas de sova, descanso e modelagem.',
          periodo: '1° semestre',
          status: 'ativa',
        },
        {
          nome: 'Molhos Artesanais',
          codigo: 'DISC-MASSA-002',
          cursoId: massaCaseira.id,
          cargaHoraria: 30,
          ementa: 'Preparo de molhos clássicos italianos: bolonhesa, pesto, carbonara.',
          periodo: '1° semestre',
          status: 'ativa',
        },
        {
          nome: 'Técnicas de Corte Japonês',
          codigo: 'DISC-SUSHI-001',
          cursoId: sushi.id,
          cargaHoraria: 25,
          ementa: 'Manuseio de facas japonesas, cortes precisos para sashimi e maki.',
          periodo: '2° semestre',
          status: 'ativa',
        },
        {
          nome: 'Fermentação Natural',
          codigo: 'DISC-PAO-001',
          cursoId: paoArtesanal.id,
          cargaHoraria: 50,
          ementa: 'Cultivo de levain, longa fermentação, autólise e scoring.',
          periodo: '1° semestre',
          status: 'ativa',
        },
      ],
    });

    await prisma.aluno.create({
      data: {
        nome: 'Pedro Pendente',
        email: 'pedro.pendente@email.com',
        senha: senhaHash,
        telefone: '(11) 91234-5678',
        dataNascimento: '1999-11-20',
        cpf: '999.888.777-66',
        matricula: gerarMatricula(),
        role: 'aluno',
        status: 'pendente',
        nivelCulinaria: 'iniciante',
        turmas: JSON.stringify([]),
        observacoes: 'Aluno aguardando aprovação do coordenador',
      },
    });

    const stats = {
      alunos: await prisma.aluno.count(),
      professores: await prisma.professor.count(),
      coordenadores: await prisma.coordenador.count(),
      cursos: await prisma.curso.count(),
      turmas: await prisma.turma.count(),
      disciplinas: await prisma.disciplina.count(),
    };

    console.log('✅ Database populado com sucesso!');
    console.log(`   - ${stats.alunos} alunos`);
    console.log(`   - ${stats.professores} professores`);
    console.log(`   - ${stats.coordenadores} coordenadores`);
    console.log(`   - ${stats.cursos} cursos`);
    console.log(`   - ${stats.turmas} turmas`);
    console.log(`   - ${stats.disciplinas} disciplinas`);
  } catch (error) {
    console.error('❌ Erro ao popular database:', error);
    throw error;
  }
}

export async function clearDatabase(): Promise<void> {
  await prisma.mensagem.deleteMany();
  await prisma.turma.deleteMany();
  await prisma.disciplina.deleteMany();
  await prisma.curso.deleteMany();
  await prisma.aluno.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.coordenador.deleteMany();
  console.log('🗑️  Database limpo');
}
