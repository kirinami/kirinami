import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { type Prisma, type Translation } from '@/prisma/client';
import PrismaService from '@/common/services/PrismaService';

@Injectable()
export default class TranslationsService implements OnModuleInit, OnModuleDestroy {
  private translations: Translation[] = [];

  constructor(private readonly prismaService: PrismaService) {}

  async onModuleInit() {
    await this.changeLanguage('en');
  }

  async onModuleDestroy() {
    this.translations = [];
  }

  async changeLanguage(language: string) {
    this.translations = await this.prismaService.translation.findMany({
      where: {
        language,
      },
    });
  }

  t(key: string) {
    return this.translations.find((translation) => translation.key === key)?.value;
  }

  async computeLanguages() {
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

  async createTranslation(data: Prisma.TranslationCreateInput) {
    return this.prismaService.translation.create({
      data,
    });
  }

  async updateTranslation(id: number, data: Prisma.TranslationUpdateInput) {
    return this.prismaService.translation.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteTranslation(id: number) {
    return this.prismaService.translation.delete({
      where: {
        id,
      },
    });
  }

  async upsertTranslations(data: Prisma.TranslationUncheckedCreateInput[]) {
    return this.prismaService.$transaction(async (prisma) => {
      const existsTranslations = await prisma.translation.findMany({
        select: {
          id: true,
        },
      });

      const createList = data
        .filter((item): item is typeof item & { id: undefined } => item.id == null || item.id === -1)
        .map((item) => ({ ...item, id: undefined }));
      const updateList = data.filter((item): item is typeof item & { id: number } => item.id != null && item.id !== -1);
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
            })
          )
        );
      }

      if (deleteList.length) {
        await prisma.translation.deleteMany({
          where: { id: { in: deleteList.map((item) => item.id) } },
        });
      }

      return true;
    });
  }
}
