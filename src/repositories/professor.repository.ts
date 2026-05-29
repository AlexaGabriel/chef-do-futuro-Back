import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import {
  Professor,
  CriarProfessorDTO,
  AtualizarProfessorDTO,
  UserRole,
  StatusUsuario,
  QueryParams,
} from '../types';

export class ProfessorRepository {
  private gerarRegistro(): string {
    const ano = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0');
    return `PROF${ano}${numero}`;
  }

  listarTodos(params?: QueryParams): Professor[] {
    let professores = Array.from(db.professores.values());

    if (params?.status) {
      professores = professores.filter((p) => p.status === params.status);
    }

    if (params?.busca) {
      const busca = params.busca.toLowerCase();
      professores = professores.filter(
        (p) =>
          p.nome.toLowerCase().includes(busca) ||
          p.email.toLowerCase().includes(busca)
      );
    }

    return professores;
  }

  buscarPorId(id: string): Professor | undefined {
    return db.professores.get(id);
  }

  buscarPorEmail(email: string): Professor | undefined {
    return Array.from(db.professores.values()).find((p) => p.email === email);
  }

  buscarPorCpf(cpf: string): Professor | undefined {
    return Array.from(db.professores.values()).find((p) => p.cpf === cpf);
  }

  criar(dto: CriarProfessorDTO): Professor {
    const now = new Date().toISOString();
    const novoProfessor: Professor = {
      id: uuidv4(),
      role: UserRole.PROFESSOR,
      registro: this.gerarRegistro(),
      status: StatusUsuario.ATIVO,
      disciplinas: dto.disciplinas || [],
      ...dto,
      criadoEm: now,
      atualizadoEm: now,
    };

    db.professores.set(novoProfessor.id, novoProfessor);
    return novoProfessor;
  }

  atualizar(id: string, dto: AtualizarProfessorDTO): Professor | null {
    const professor = db.professores.get(id);
    if (!professor) return null;

    const professorAtualizado: Professor = {
      ...professor,
      ...dto,
      atualizadoEm: new Date().toISOString(),
    };

    db.professores.set(id, professorAtualizado);
    return professorAtualizado;
  }

  deletar(id: string): boolean {
    return db.professores.delete(id);
  }

  contar(): number {
    return db.professores.size;
  }
}
