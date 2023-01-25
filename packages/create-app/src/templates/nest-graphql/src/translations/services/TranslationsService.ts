import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { type Translation } from '@/prisma/client';
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
}
