import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import {
  Aluno,
  CriarAlunoDTO,
  AtualizarAlunoDTO,
  UserRole,
  StatusUsuario,
  QueryParams,
} from '../types';

export class AlunoRepository {
  private gerarMatricula(): string {
    const ano = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0');
    return `ALU${ano}${numero}`;
  }

  listarTodos(params?: QueryParams): Aluno[] {
    let alunos = Array.from(db.alunos.values());

    if (params?.status) {
      alunos = alunos.filter((a) => a.status === params.status);
    }

    if (params?.busca) {
      const busca = params.busca.toLowerCase();
      alunos = alunos.filter(
        (a) =>
          a.nome.toLowerCase().includes(busca) ||
          a.email.toLowerCase().includes(busca)
      );
    }

    return alunos;
  }

  buscarPorId(id: string): Aluno | undefined {
    return db.alunos.get(id);
  }

  buscarPorEmail(email: string): Aluno | undefined {
    return Array.from(db.alunos.values()).find((a) => a.email === email);
  }

  buscarPorCpf(cpf: string): Aluno | undefined {
    return Array.from(db.alunos.values()).find((a) => a.cpf === cpf);
  }

  criar(dto: CriarAlunoDTO): Aluno {
    const now = new Date().toISOString();
    const novoAluno: Aluno = {
      id: uuidv4(),
      role: UserRole.ALUNO,
      matricula: this.gerarMatricula(),
      status: StatusUsuario.ATIVO,
      turmas: dto.turmas || [],
      ...dto,
      criadoEm: now,
      atualizadoEm: now,
    };

    db.alunos.set(novoAluno.id, novoAluno);
    return novoAluno;
  }

  atualizar(id: string, dto: AtualizarAlunoDTO): Aluno | null {
    const aluno = db.alunos.get(id);
    if (!aluno) return null;

    const alunoAtualizado: Aluno = {
      ...aluno,
      ...dto,
      atualizadoEm: new Date().toISOString(),
    };

    db.alunos.set(id, alunoAtualizado);
    return alunoAtualizado;
  }

  deletar(id: string): boolean {
    return db.alunos.delete(id);
  }

  contar(): number {
    return db.alunos.size;
  }
}
