import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { Prisma } from '@prisma/client';

import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class TranslationsService {
  readonly pubSub = new PubSub();

  constructor(private readonly prismaService: PrismaService) {}

  async getAvailableLanguages() {
    const translations = await this.prismaService.translation.groupBy({
      by: ['language'],
    });

    return translations.map((translation) => translation.language);
  }

  async findManyByLanguage(language: string) {
    return this.prismaService.translation.findMany({
      where: {
        language,
      },
    });
  }

  async upsertTranslations(data: Prisma.TranslationUncheckedCreateInput[]) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const existsTranslations = await prisma.translation.findMany({
          select: {
            id: true,
          },
        });

        const createList = data
          .filter((item): item is typeof item & { id: undefined } => item.id == null || item.id === -1)
          .map((item) => ({ ...item, id: undefined }));
        const updateList = data.filter(
          (
            item,
          ): item is typeof item & {
            id: number;
          } => item.id != null && item.id !== -1,
        );
        const deleteList = existsTranslations.filter(({ id }) => !updateList.some((item) => item.id === id));

        if (createList.length) {
          await prisma.translation.createMany({
            data: createList,
          });
        }

        if (updateList.length) {
          await Promise.all(
            updateList.map((item) =>
              prisma.translation.update({
                where: { id: item.id },
                data: { ...item, id: undefined },
              }),
            ),
          );
        }

        if (deleteList.length) {
          await prisma.translation.deleteMany({
            where: { id: { in: deleteList.map((item) => item.id) } },
          });
        }

        return true;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new BadRequestException();
        if (error.code === 'P2025') throw new NotFoundException();
      }

      throw error;
    }
  }

  async createTranslation(data: Prisma.TranslationCreateInput) {
    try {
      return await this.prismaService.translation.create({
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new BadRequestException();
      }

      throw error;
    }
  }

  async updateTranslation(id: number, data: Prisma.TranslationUpdateInput) {
    try {
      return await this.prismaService.translation.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new BadRequestException();
        if (error.code === 'P2025') throw new NotFoundException();
      }

      throw error;
    }
  }

  async deleteTranslation(id: number) {
    try {
      return await this.prismaService.translation.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException();
      }

      throw error;
    }
  }
}
