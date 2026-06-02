import { prisma } from '../lib/prisma';
import { UserRole, StatusUsuario } from '../types';
import {
  CriarCoordenadorDTO,
  AtualizarCoordenadorDTO,
  QueryParams,
} from '../types';
import { AuthService } from '../services/auth.service';

export class CoordenadorRepository {
  private gerarRegistro(): string {
    const ano = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0');

    return `COORD${ano}${numero}`;
  }

  async listarTodos(params?: QueryParams) {
    return prisma.coordenador.findMany({
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
    return prisma.coordenador.findUnique({
      where: { id },
    });
  }

  async buscarPorEmail(email: string) {
    return prisma.coordenador.findUnique({
      where: { email },
    });
  }

  async buscarPorCpf(cpf: string) {
    return prisma.coordenador.findUnique({
      where: { cpf },
    });
  }

  async criar(dto: CriarCoordenadorDTO) {
    const senhaHash = await AuthService.hashPassword(dto.senha);
    
    return prisma.coordenador.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: senhaHash,
        telefone: dto.telefone,
        cpf: dto.cpf,
        departamento: dto.departamento,
        ramal: dto.ramal,
        permissoes: JSON.stringify(dto.permissoes),
        registro: this.gerarRegistro(),
        role: UserRole.COORDENADOR,
        status: StatusUsuario.ATIVO,
      },
    });
  }

  async atualizar(id: string, dto: AtualizarCoordenadorDTO) {
    try {
      const data: any = { ...dto };
      if (dto.permissoes) {
        data.permissoes = JSON.stringify(dto.permissoes);
      }
      return await prisma.coordenador.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async deletar(id: string): Promise<boolean> {
    try {
      await prisma.coordenador.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }

  async contar(): Promise<number> {
    return prisma.coordenador.count();
  }
}

