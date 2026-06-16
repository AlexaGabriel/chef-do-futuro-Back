import { CriarAlunoDTO, AtualizarAlunoDTO, QueryParams, UserRole, StatusUsuario } from '../types';
import { prisma } from '../lib/prisma';
import { AuthService } from '../services/auth.service';

export class AlunoRepository {
  private gerarMatricula(): string {
    const ano = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0');

    return `ALU${ano}${numero}`;
  }

  async listarTodos(params?: QueryParams) {
    return prisma.aluno.findMany({
      where: {
        ...(params?.status && { status: params.status }),

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
    return prisma.aluno.findUnique({
      where: { id },
    });
  }

  async buscarPorEmail(email: string) {
    return prisma.aluno.findUnique({
      where: { email },
    });
  }

  async buscarPorCpf(cpf: string) {
    return prisma.aluno.findUnique({
      where: { cpf },
    });
  }

  async criar(dto: CriarAlunoDTO) {
    const senhaHash = await AuthService.hashPassword(dto.senha);
    
    return prisma.aluno.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: senhaHash,
        telefone: dto.telefone,
        dataNascimento: dto.dataNascimento,
        cpf: dto.cpf,
        nivelCulinaria: dto.nivelCulinaria,
        observacoes: dto.observacoes,
        turmas: JSON.stringify(dto.turmas ?? []),
        matricula: this.gerarMatricula(),
        role: UserRole.ALUNO,
        status: StatusUsuario.PENDENTE,
      },
    });
  }

  async atualizar(id: string, dto: AtualizarAlunoDTO) {
    try {
      const data: any = { ...dto };
      if (dto.turmas) {
        data.turmas = JSON.stringify(dto.turmas);
      }
      return await prisma.aluno.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async deletar(id: string): Promise<boolean> {
    try {
      await prisma.aluno.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }

  async contar(): Promise<number> {
    return prisma.aluno.count();
  }

  async aprovar(id: string) {
    return prisma.aluno.update({
      where: { id },
      data: { status: StatusUsuario.ATIVO },
    });
  }
}



