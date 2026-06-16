export enum UserRole {
  ALUNO = 'aluno',
  PROFESSOR = 'professor',
  COORDENADOR = 'coordenador',
}

export enum StatusUsuario {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  SUSPENSO = 'suspenso',
  PENDENTE = 'pendente',
}

export enum NivelCulinaria {
  INICIANTE = 'iniciante',
  INTERMEDIARIO = 'intermediario',
  AVANCADO = 'avancado',
}

export interface BaseEntity {
  id: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Aluno extends BaseEntity {
  role: UserRole.ALUNO;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  matricula: string;
  status: StatusUsuario;
  nivelCulinaria: NivelCulinaria;
  turmas: string[];
  observacoes?: string;
}

export interface CriarAlunoDTO {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  nivelCulinaria: NivelCulinaria;
  turmas?: string[];
  observacoes?: string;
}

export interface AtualizarAlunoDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  nivelCulinaria?: NivelCulinaria;
  status?: StatusUsuario;
  turmas?: string[];
  observacoes?: string;
}

export interface Professor extends BaseEntity {
  role: UserRole.PROFESSOR;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  registro: string;
  status: StatusUsuario;
  especialidades: string[];
  disciplinas: string[];
  bio?: string;
  cargaHoraria: number;
}

export interface CriarProfessorDTO {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
  especialidades: string[];
  disciplinas?: string[];
  bio?: string;
  cargaHoraria: number;
}

export interface AtualizarProfessorDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  especialidades?: string[];
  disciplinas?: string[];
  bio?: string;
  cargaHoraria?: number;
  status?: StatusUsuario;
}

export interface Coordenador extends BaseEntity {
  role: UserRole.COORDENADOR;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  registro: string;
  status: StatusUsuario;
  departamento: string;
  permissoes: Permissao[];
  ramal?: string;
}

export type Permissao =
  | 'gerenciar_alunos'
  | 'gerenciar_professores'
  | 'gerenciar_turmas'
  | 'gerenciar_disciplinas'
  | 'emitir_relatorios'
  | 'gerenciar_financeiro';

export interface CriarCoordenadorDTO {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
  departamento: string;
  permissoes: Permissao[];
  ramal?: string;
}

export interface AtualizarCoordenadorDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  departamento?: string;
  permissoes?: Permissao[];
  ramal?: string;
  status?: StatusUsuario;
}

export interface ApiResponse<T> {
  sucesso: boolean;
  dados?: T;
  mensagem?: string;
  erro?: string;
}

export interface PaginatedResponse<T> {
  sucesso: boolean;
  dados: T[];
  paginacao: {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
  };
}

export interface QueryParams {
  pagina?: number;
  limite?: number;
  busca?: string;
  status?: StatusUsuario;
}

export enum NivelCurso {
  INICIANTE = 'iniciante',
  INTERMEDIARIO = 'intermediario',
  AVANCADO = 'avancado',
}

export enum StatusCurso {
  RASCUNHO = 'rascunho',
  PUBLICADO = 'publicado',
  ARQUIVADO = 'arquivado',
}

export interface Licao {
  id: string;
  titulo: string;
  duracao: number;
  videoUrl?: string;
  conteudo?: string;
  ordem: number;
  concluida?: boolean;
}

export interface Secao {
  id: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  licoes: Licao[];
}

export interface Curso extends BaseEntity {
  titulo: string;
  descricao: string;
  imagemUrl: string;
  nivel: NivelCurso;
  status: StatusCurso;
  duracao: number;
  secoes: Secao[];
  professorId: string;
  categoria: string;
  tags: string[];
  quantidadeAlunos: number;
}

export interface CriarCursoDTO {
  titulo: string;
  descricao: string;
  imagemUrl: string;
  nivel: NivelCurso;
  duracao: number;
  professorId: string;
  categoria: string;
  tags?: string[];
  secoes?: Secao[];
}

export interface AtualizarCursoDTO {
  titulo?: string;
  descricao?: string;
  imagemUrl?: string;
  nivel?: NivelCurso;
  status?: StatusCurso;
  duracao?: number;
  professorId?: string;
  categoria?: string;
  tags?: string[];
  secoes?: Secao[];
}

// Tipos de Turma
export enum StatusTurma {
  ATIVA = 'ativa',
  CONCLUIDA = 'concluida',
  CANCELADA = 'cancelada',
}

export enum PeriodoTurma {
  MATUTINO = 'matutino',
  VESPERTINO = 'vespertino',
  NOTURNO = 'noturno',
  INTEGRAL = 'integral',
}

export interface Turma extends BaseEntity {
  nome: string;
  codigo: string;
  cursoId: string;
  periodo: PeriodoTurma;
  capacidade: number;
  status: StatusTurma;
  dataInicio: string;
  dataFim: string;
}

export interface CriarTurmaDTO {
  nome: string;
  codigo: string;
  periodo: PeriodoTurma;
  capacidade?: number;
  dataInicio: string;
  dataFim: string;
}

export interface AtualizarTurmaDTO {
  nome?: string;
  codigo?: string;
  periodo?: PeriodoTurma;
  capacidade?: number;
  status?: StatusTurma;
  dataInicio?: string;
  dataFim?: string;
}

// Tipos de Disciplina
export enum StatusDisciplina {
  ATIVA = 'ativa',
  INATIVA = 'inativa',
}

export interface Disciplina extends BaseEntity {
  nome: string;
  codigo: string;
  cursoId: string;
  cargaHoraria: number;
  ementa?: string;
  periodo: string;
  status: StatusDisciplina;
}

export interface CriarDisciplinaDTO {
  nome: string;
  codigo: string;
  cargaHoraria: number;
  ementa?: string;
  periodo: string;
}

export interface AtualizarDisciplinaDTO {
  nome?: string;
  codigo?: string;
  cargaHoraria?: number;
  ementa?: string;
  periodo?: string;
  status?: StatusDisciplina;
}

// Tipos de Autenticação
export interface LoginDTO {
  email: string;
  senha: string;
}

export interface LoginResponse {
  sucesso: boolean;
  dados?: {
    token: string;
    usuario: {
      id: string;
      nome: string;
      email: string;
      role: UserRole;
    };
  };
  mensagem?: string;
  erro?: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest {
  user?: JWTPayload;
}
