export enum UserRole {
  ALUNO = 'aluno',
  PROFESSOR = 'professor',
  COORDENADOR = 'coordenador',
}

export enum StatusUsuario {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  SUSPENSO = 'suspenso',
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
