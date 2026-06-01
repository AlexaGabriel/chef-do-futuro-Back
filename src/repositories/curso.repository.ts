import { prisma } from '../lib/prisma';
import {
  Curso,
  CriarCursoDTO,
  AtualizarCursoDTO,
  NivelCurso,
  StatusCurso,
  QueryParams,
} from '../types';

export class CursoRepository {
  async listarTodos(params?: QueryParams): Promise<Curso[]> {
    const where: any = {};

    if (params?.busca) {
      const busca = params.busca.toLowerCase();
      where.OR = [
        { titulo: { contains: busca, mode: 'insensitive' } },
        { descricao: { contains: busca, mode: 'insensitive' } },
        { categoria: { contains: busca, mode: 'insensitive' } },
      ];
    }

    const cursos = await prisma.curso.findMany({ where });

    return cursos.map((c: any) => ({
      ...c,
      nivel: c.nivel as NivelCurso,
      status: c.status as StatusCurso,
      criadoEm: c.criadoEm.toISOString(),
      atualizadoEm: c.atualizadoEm.toISOString(),
      tags: JSON.parse(c.tags),
      secoes: JSON.parse(c.secoes),
    }));
  }

  async buscarPorId(id: string): Promise<Curso | null> {
    const curso = await prisma.curso.findUnique({
      where: { id },
    });

    if (!curso) return null;

    return {
      ...curso,
      nivel: curso.nivel as NivelCurso,
      status: curso.status as StatusCurso,
      criadoEm: curso.criadoEm.toISOString(),
      atualizadoEm: curso.atualizadoEm.toISOString(),
      tags: JSON.parse(curso.tags),
      secoes: JSON.parse(curso.secoes),
    };
  }

  async buscarPorProfessor(professorId: string): Promise<Curso[]> {
    const cursos = await prisma.curso.findMany({
      where: { professorId },
    });

    return cursos.map((c: any) => ({
      ...c,
      nivel: c.nivel as NivelCurso,
      status: c.status as StatusCurso,
      criadoEm: c.criadoEm.toISOString(),
      atualizadoEm: c.atualizadoEm.toISOString(),
      tags: JSON.parse(c.tags),
      secoes: JSON.parse(c.secoes),
    }));
  }

  async buscarPorCategoria(categoria: string): Promise<Curso[]> {
    const cursos = await prisma.curso.findMany({
      where: {
        categoria: {
          equals: categoria,
          mode: 'insensitive',
        },
      },
    });

    return cursos.map((c: any) => ({
      ...c,
      nivel: c.nivel as NivelCurso,
      status: c.status as StatusCurso,
      criadoEm: c.criadoEm.toISOString(),
      atualizadoEm: c.atualizadoEm.toISOString(),
      tags: JSON.parse(c.tags),
      secoes: JSON.parse(c.secoes),
    }));
  }

  async criar(dto: CriarCursoDTO): Promise<Curso> {
    const curso = await prisma.curso.create({
      data: {
        titulo: dto.titulo,
        descricao: dto.descricao,
        imagemUrl: dto.imagemUrl,
        nivel: dto.nivel,
        status: StatusCurso.RASCUNHO,
        duracao: dto.duracao,
        professorId: dto.professorId,
        categoria: dto.categoria,
        tags: JSON.stringify(dto.tags || []),
        secoes: JSON.stringify(dto.secoes || []),
        quantidadeAlunos: 0,
      },
    });

    return {
      ...curso,
      nivel: curso.nivel as NivelCurso,
      status: curso.status as StatusCurso,
      criadoEm: curso.criadoEm.toISOString(),
      atualizadoEm: curso.atualizadoEm.toISOString(),
      tags: JSON.parse(curso.tags),
      secoes: JSON.parse(curso.secoes),
    };
  }

  async atualizar(id: string, dto: AtualizarCursoDTO): Promise<Curso | null> {
    const exists = await prisma.curso.findUnique({ where: { id } });
    if (!exists) return null;

    const data: any = {};
    if (dto.titulo !== undefined) data.titulo = dto.titulo;
    if (dto.descricao !== undefined) data.descricao = dto.descricao;
    if (dto.imagemUrl !== undefined) data.imagemUrl = dto.imagemUrl;
    if (dto.nivel !== undefined) data.nivel = dto.nivel;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.duracao !== undefined) data.duracao = dto.duracao;
    if (dto.professorId !== undefined) data.professorId = dto.professorId;
    if (dto.categoria !== undefined) data.categoria = dto.categoria;
    if (dto.tags !== undefined) data.tags = JSON.stringify(dto.tags);
    if (dto.secoes !== undefined) data.secoes = JSON.stringify(dto.secoes);

    const curso = await prisma.curso.update({
      where: { id },
      data,
    });

    return {
      ...curso,
      nivel: curso.nivel as NivelCurso,
      status: curso.status as StatusCurso,
      criadoEm: curso.criadoEm.toISOString(),
      atualizadoEm: curso.atualizadoEm.toISOString(),
      tags: JSON.parse(curso.tags),
      secoes: JSON.parse(curso.secoes),
    };
  }

  async deletar(id: string): Promise<boolean> {
    try {
      await prisma.curso.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async contar(): Promise<number> {
    return await prisma.curso.count();
  }
}
