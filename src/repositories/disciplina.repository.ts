import { prisma } from '../lib/prisma';
import {
  CriarDisciplinaDTO,
  AtualizarDisciplinaDTO,
  StatusDisciplina,
} from '../types';

export class DisciplinaRepository {
  async listarPorCurso(cursoId: string) {
    const disciplinas = await prisma.disciplina.findMany({
      where: { cursoId },
      orderBy: { criadoEm: 'desc' },
    });

    return disciplinas.map((d) => ({
      ...d,
      status: d.status as StatusDisciplina,
      criadoEm: d.criadoEm.toISOString(),
      atualizadoEm: d.atualizadoEm.toISOString(),
    }));
  }

  async buscarPorId(id: string) {
    const disciplina = await prisma.disciplina.findUnique({ where: { id } });
    if (!disciplina) return null;

    return {
      ...disciplina,
      status: disciplina.status as StatusDisciplina,
      criadoEm: disciplina.criadoEm.toISOString(),
      atualizadoEm: disciplina.atualizadoEm.toISOString(),
    };
  }

  async criar(cursoId: string, dto: CriarDisciplinaDTO) {
    const curso = await prisma.curso.findUnique({ where: { id: cursoId } });
    if (!curso) return null;

    const disciplina = await prisma.disciplina.create({
      data: {
        nome: dto.nome,
        codigo: dto.codigo,
        cursoId,
        cargaHoraria: dto.cargaHoraria,
        ementa: dto.ementa ?? null,
        periodo: dto.periodo,
        status: StatusDisciplina.ATIVA,
      },
    });

    return {
      ...disciplina,
      status: disciplina.status as StatusDisciplina,
      criadoEm: disciplina.criadoEm.toISOString(),
      atualizadoEm: disciplina.atualizadoEm.toISOString(),
    };
  }

  async atualizar(id: string, dto: AtualizarDisciplinaDTO) {
    const exists = await prisma.disciplina.findUnique({ where: { id } });
    if (!exists) return null;

    const data: any = {};
    if (dto.nome !== undefined) data.nome = dto.nome;
    if (dto.codigo !== undefined) data.codigo = dto.codigo;
    if (dto.cargaHoraria !== undefined) data.cargaHoraria = dto.cargaHoraria;
    if (dto.ementa !== undefined) data.ementa = dto.ementa;
    if (dto.periodo !== undefined) data.periodo = dto.periodo;
    if (dto.status !== undefined) data.status = dto.status;

    const disciplina = await prisma.disciplina.update({ where: { id }, data });

    return {
      ...disciplina,
      status: disciplina.status as StatusDisciplina,
      criadoEm: disciplina.criadoEm.toISOString(),
      atualizadoEm: disciplina.atualizadoEm.toISOString(),
    };
  }

  async deletar(id: string): Promise<boolean> {
    try {
      await prisma.disciplina.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async verificarPertenceAoCurso(disciplinaId: string, cursoId: string): Promise<boolean> {
    const disciplina = await prisma.disciplina.findUnique({ where: { id: disciplinaId } });
    return disciplina?.cursoId === cursoId;
  }
}
