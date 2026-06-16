import { prisma } from '../lib/prisma';
import {
  CriarTurmaDTO,
  AtualizarTurmaDTO,
  StatusTurma,
  PeriodoTurma,
} from '../types';

export class TurmaRepository {
  async listarPorCurso(cursoId: string) {
    const turmas = await prisma.turma.findMany({
      where: { cursoId },
      orderBy: { criadoEm: 'desc' },
    });

    return turmas.map((t) => ({
      ...t,
      periodo: t.periodo as PeriodoTurma,
      status: t.status as StatusTurma,
      criadoEm: t.criadoEm.toISOString(),
      atualizadoEm: t.atualizadoEm.toISOString(),
    }));
  }

  async buscarPorId(id: string) {
    const turma = await prisma.turma.findUnique({ where: { id } });
    if (!turma) return null;

    return {
      ...turma,
      periodo: turma.periodo as PeriodoTurma,
      status: turma.status as StatusTurma,
      criadoEm: turma.criadoEm.toISOString(),
      atualizadoEm: turma.atualizadoEm.toISOString(),
    };
  }

  async criar(cursoId: string, dto: CriarTurmaDTO) {
    const curso = await prisma.curso.findUnique({ where: { id: cursoId } });
    if (!curso) return null;

    const turma = await prisma.turma.create({
      data: {
        nome: dto.nome,
        codigo: dto.codigo,
        cursoId,
        periodo: dto.periodo,
        capacidade: dto.capacidade ?? 30,
        status: StatusTurma.ATIVA,
        dataInicio: dto.dataInicio,
        dataFim: dto.dataFim,
      },
    });

    return {
      ...turma,
      periodo: turma.periodo as PeriodoTurma,
      status: turma.status as StatusTurma,
      criadoEm: turma.criadoEm.toISOString(),
      atualizadoEm: turma.atualizadoEm.toISOString(),
    };
  }

  async atualizar(id: string, dto: AtualizarTurmaDTO) {
    const exists = await prisma.turma.findUnique({ where: { id } });
    if (!exists) return null;

    const data: any = {};
    if (dto.nome !== undefined) data.nome = dto.nome;
    if (dto.codigo !== undefined) data.codigo = dto.codigo;
    if (dto.periodo !== undefined) data.periodo = dto.periodo;
    if (dto.capacidade !== undefined) data.capacidade = dto.capacidade;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.dataInicio !== undefined) data.dataInicio = dto.dataInicio;
    if (dto.dataFim !== undefined) data.dataFim = dto.dataFim;

    const turma = await prisma.turma.update({ where: { id }, data });

    return {
      ...turma,
      periodo: turma.periodo as PeriodoTurma,
      status: turma.status as StatusTurma,
      criadoEm: turma.criadoEm.toISOString(),
      atualizadoEm: turma.atualizadoEm.toISOString(),
    };
  }

  async deletar(id: string): Promise<boolean> {
    try {
      await prisma.turma.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async verificarPertenceAoCurso(turmaId: string, cursoId: string): Promise<boolean> {
    const turma = await prisma.turma.findUnique({ where: { id: turmaId } });
    return turma?.cursoId === cursoId;
  }
}
