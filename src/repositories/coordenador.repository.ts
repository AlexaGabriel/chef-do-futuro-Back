import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import {
  Coordenador,
  CriarCoordenadorDTO,
  AtualizarCoordenadorDTO,
  UserRole,
  StatusUsuario,
  QueryParams,
} from '../types';

export class CoordenadorRepository {
  private gerarRegistro(): string {
    const ano = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0');
    return `COORD${ano}${numero}`;
  }

  listarTodos(params?: QueryParams): Coordenador[] {
    let coordenadores = Array.from(db.coordenadores.values());

    if (params?.status) {
      coordenadores = coordenadores.filter((c) => c.status === params.status);
    }

    if (params?.busca) {
      const busca = params.busca.toLowerCase();
      coordenadores = coordenadores.filter(
        (c) =>
          c.nome.toLowerCase().includes(busca) ||
          c.email.toLowerCase().includes(busca)
      );
    }

    return coordenadores;
  }

  buscarPorId(id: string): Coordenador | undefined {
    return db.coordenadores.get(id);
  }

  buscarPorEmail(email: string): Coordenador | undefined {
    return Array.from(db.coordenadores.values()).find((c) => c.email === email);
  }

  buscarPorCpf(cpf: string): Coordenador | undefined {
    return Array.from(db.coordenadores.values()).find((c) => c.cpf === cpf);
  }

  criar(dto: CriarCoordenadorDTO): Coordenador {
    const now = new Date().toISOString();
    const novoCoordenador: Coordenador = {
      id: uuidv4(),
      role: UserRole.COORDENADOR,
      registro: this.gerarRegistro(),
      status: StatusUsuario.ATIVO,
      ...dto,
      criadoEm: now,
      atualizadoEm: now,
    };

    db.coordenadores.set(novoCoordenador.id, novoCoordenador);
    return novoCoordenador;
  }

  atualizar(id: string, dto: AtualizarCoordenadorDTO): Coordenador | null {
    const coordenador = db.coordenadores.get(id);
    if (!coordenador) return null;

    const coordenadorAtualizado: Coordenador = {
      ...coordenador,
      ...dto,
      atualizadoEm: new Date().toISOString(),
    };

    db.coordenadores.set(id, coordenadorAtualizado);
    return coordenadorAtualizado;
  }

  deletar(id: string): boolean {
    return db.coordenadores.delete(id);
  }

  contar(): number {
    return db.coordenadores.size;
  }
}
