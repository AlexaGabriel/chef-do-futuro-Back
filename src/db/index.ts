import { v4 as uuidv4 } from 'uuid';
import {
  Aluno,
  Professor,
  Coordenador,
  UserRole,
  StatusUsuario,
  NivelCulinaria,
} from '../types';

export const db = {
  alunos: new Map<string, Aluno>(),
  professores: new Map<string, Professor>(),
  coordenadores: new Map<string, Coordenador>(),
};

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

export function seedDatabase(): void {
  const now = new Date().toISOString();

  const aluno1: Aluno = {
    id: uuidv4(),
    role: UserRole.ALUNO,
    nome: 'Maria Silva',
    email: 'maria.silva@email.com',
    telefone: '(11) 98765-4321',
    dataNascimento: '1995-05-15',
    cpf: '123.456.789-00',
    matricula: gerarMatricula(),
    status: StatusUsuario.ATIVO,
    nivelCulinaria: NivelCulinaria.INICIANTE,
    turmas: [],
    observacoes: 'Interesse em confeitaria',
    criadoEm: now,
    atualizadoEm: now,
  };

  const aluno2: Aluno = {
    id: uuidv4(),
    role: UserRole.ALUNO,
    nome: 'João Santos',
    email: 'joao.santos@email.com',
    telefone: '(11) 97654-3210',
    dataNascimento: '1998-08-22',
    cpf: '234.567.890-11',
    matricula: gerarMatricula(),
    status: StatusUsuario.ATIVO,
    nivelCulinaria: NivelCulinaria.INTERMEDIARIO,
    turmas: [],
    criadoEm: now,
    atualizadoEm: now,
  };

  const aluno3: Aluno = {
    id: uuidv4(),
    role: UserRole.ALUNO,
    nome: 'Ana Costa',
    email: 'ana.costa@email.com',
    telefone: '(21) 99876-5432',
    dataNascimento: '2000-03-10',
    cpf: '345.678.901-22',
    matricula: gerarMatricula(),
    status: StatusUsuario.ATIVO,
    nivelCulinaria: NivelCulinaria.AVANCADO,
    turmas: [],
    observacoes: 'Experiência em gastronomia francesa',
    criadoEm: now,
    atualizadoEm: now,
  };

  const professor1: Professor = {
    id: uuidv4(),
    role: UserRole.PROFESSOR,
    nome: 'Chef Carlos Mendes',
    email: 'carlos.mendes@escola.com',
    telefone: '(11) 3456-7890',
    cpf: '456.789.012-33',
    registro: gerarRegistro('PROF'),
    status: StatusUsuario.ATIVO,
    especialidades: ['Culinária Italiana', 'Massas Artesanais'],
    disciplinas: [],
    bio: 'Chef com 15 anos de experiência em restaurantes estrelados',
    cargaHoraria: 40,
    criadoEm: now,
    atualizadoEm: now,
  };

  const professor2: Professor = {
    id: uuidv4(),
    role: UserRole.PROFESSOR,
    nome: 'Chef Patricia Oliveira',
    email: 'patricia.oliveira@escola.com',
    telefone: '(11) 3456-7891',
    cpf: '567.890.123-44',
    registro: gerarRegistro('PROF'),
    status: StatusUsuario.ATIVO,
    especialidades: ['Confeitaria', 'Chocolateria'],
    disciplinas: [],
    bio: 'Especialista em doces finos e confeitaria francesa',
    cargaHoraria: 30,
    criadoEm: now,
    atualizadoEm: now,
  };

  const professor3: Professor = {
    id: uuidv4(),
    role: UserRole.PROFESSOR,
    nome: 'Chef Roberto Alves',
    email: 'roberto.alves@escola.com',
    telefone: '(21) 3456-7892',
    cpf: '678.901.234-55',
    registro: gerarRegistro('PROF'),
    status: StatusUsuario.ATIVO,
    especialidades: ['Gastronomia Contemporânea', 'Técnicas Moleculares'],
    disciplinas: [],
    cargaHoraria: 35,
    criadoEm: now,
    atualizadoEm: now,
  };

  const coordenador1: Coordenador = {
    id: uuidv4(),
    role: UserRole.COORDENADOR,
    nome: 'Fernanda Lima',
    email: 'fernanda.lima@escola.com',
    telefone: '(11) 3456-7800',
    cpf: '789.012.345-66',
    registro: gerarRegistro('COORD'),
    status: StatusUsuario.ATIVO,
    departamento: 'Acadêmico',
    permissoes: [
      'gerenciar_alunos',
      'gerenciar_professores',
      'gerenciar_turmas',
      'gerenciar_disciplinas',
    ],
    ramal: '1001',
    criadoEm: now,
    atualizadoEm: now,
  };

  const coordenador2: Coordenador = {
    id: uuidv4(),
    role: UserRole.COORDENADOR,
    nome: 'Ricardo Pereira',
    email: 'ricardo.pereira@escola.com',
    telefone: '(11) 3456-7801',
    cpf: '890.123.456-77',
    registro: gerarRegistro('COORD'),
    status: StatusUsuario.ATIVO,
    departamento: 'Administrativo',
    permissoes: ['emitir_relatorios', 'gerenciar_financeiro'],
    ramal: '1002',
    criadoEm: now,
    atualizadoEm: now,
  };

  db.alunos.set(aluno1.id, aluno1);
  db.alunos.set(aluno2.id, aluno2);
  db.alunos.set(aluno3.id, aluno3);

  db.professores.set(professor1.id, professor1);
  db.professores.set(professor2.id, professor2);
  db.professores.set(professor3.id, professor3);

  db.coordenadores.set(coordenador1.id, coordenador1);
  db.coordenadores.set(coordenador2.id, coordenador2);

  console.log('✅ Database populado com sucesso!');
  console.log(`   - ${db.alunos.size} alunos`);
  console.log(`   - ${db.professores.size} professores`);
  console.log(`   - ${db.coordenadores.size} coordenadores`);
}

export function clearDatabase(): void {
  db.alunos.clear();
  db.professores.clear();
  db.coordenadores.clear();
  console.log('🗑️  Database limpo');
}
