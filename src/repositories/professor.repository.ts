import { prisma } from '../lib/prisma';
import { UserRole, StatusUsuario } from '../types';
import {
  CriarProfessorDTO,
  AtualizarProfessorDTO,
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

  async listarTodos(params?: QueryParams) {
    return prisma.professor.findMany({
      where: {
        ...(params?.status && {
          status: params.status,
        }),

        ...(params?.busca && {
          OR: [
            {
              nome: {
                contains: params.busca,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: params.busca,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
    });
  }

  async buscarPorId(id: string) {
    return prisma.professor.findUnique({
      where: { id },
    });
  }

  async buscarPorEmail(email: string) {
    return prisma.professor.findUnique({
      where: { email },
    });
  }

  async buscarPorCpf(cpf: string) {
    return prisma.professor.findUnique({
      where: { cpf },
    });
  }

  async criar(dto: CriarProfessorDTO) {
    return prisma.professor.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        telefone: dto.telefone,
        cpf: dto.cpf,
        bio: dto.bio,
        cargaHoraria: dto.cargaHoraria,
        especialidades: JSON.stringify(dto.especialidades),
        disciplinas: JSON.stringify(dto.disciplinas ?? []),
        registro: this.gerarRegistro(),
        role: UserRole.PROFESSOR,
        status: StatusUsuario.ATIVO,
      },
    });
  }

  async atualizar(id: string, dto: AtualizarProfessorDTO) {
    try {
      const data: any = { ...dto };
      if (dto.especialidades) {
        data.especialidades = JSON.stringify(dto.especialidades);
      }
      if (dto.disciplinas) {
        data.disciplinas = JSON.stringify(dto.disciplinas);
      }
      return await prisma.professor.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async deletar(id: string): Promise<boolean> {
    try {
      await prisma.professor.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }

  async contar(): Promise<number> {
    return prisma.professor.count();
  }
}

