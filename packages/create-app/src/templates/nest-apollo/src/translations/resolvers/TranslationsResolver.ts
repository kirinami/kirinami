import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import JwtAccess from '@/auth/decorators/JwtAccess';
import PrismaService from '@/common/services/PrismaService';

import CreateTranslationArgs from '../args/CreateTranslationArgs';
import DeleteTranslationArgs from '../args/DeleteTranslationArgs';
import GetLanguagesArgs from '../args/GetLanguagesArgs';
import GetTranslationsArgs from '../args/GetTranslationsArgs';
import UpdateTranslationArgs from '../args/UpdateTranslationArgs';
import UpsertTranslationArgs from '../args/UpsertTranslationArgs';
import TranslationType from '../types/TranslationType';

@Resolver(() => TranslationType)
export default class TranslationsResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query(() => [String])
  async getLanguages(@Args() {}: GetLanguagesArgs): Promise<string[]> {
    const translations = await this.prismaService.translation.groupBy({
      by: ['language'],
    });

    return translations.map((translation) => translation.language);
  }

  @Query(() => [TranslationType])
  async getTranslations(@Args() { language }: GetTranslationsArgs): Promise<TranslationType[]> {
    return this.prismaService.translation.findMany({
      where: {
        language,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  @JwtAccess(['Admin'])
  @Mutation(() => TranslationType)
  async createTranslation(@Args() { input }: CreateTranslationArgs): Promise<TranslationType> {
    return this.prismaService.translation.create({
      data: input,
    });
  }

  @JwtAccess(['Admin'])
  @Mutation(() => TranslationType)
  async updateTranslation(@Args() { input: { id, ...input } }: UpdateTranslationArgs): Promise<TranslationType> {
    return this.prismaService.translation.update({
      where: {
        id,
      },
      data: input,
    });
  }

  @JwtAccess(['Admin'])
  @Mutation(() => Boolean)
  async upsertTranslation(@Args() { input }: UpsertTranslationArgs): Promise<boolean> {
    const translationIds = await this.prismaService.translation.findMany({
      select: {
        id: true,
      },
    });

    const createInput = input.filter((item) => item.id === -1).map((item) => ({ ...item, id: undefined }));
    const updateInput = input.filter((item) => item.id !== -1);
    const removeInput = translationIds.filter(({ id }) => !updateInput.some((item) => item.id === id));

    if (createInput.length) {
      await Promise.all(
        createInput.map((data) =>
          this.prismaService.translation.create({
            data,
          })
        )
      );
    }

    if (updateInput.length) {
      await Promise.all(
        updateInput.map(({ id, ...data }) =>
          this.prismaService.translation.update({
            where: {
              id,
            },
            data,
          })
        )
      );
    }

    if (removeInput.length) {
      await this.prismaService.translation.deleteMany({
        where: {
          id: {
            in: removeInput.map(({ id }) => id),
          },
        },
      });
    }

    return true;
  }

  @JwtAccess(['Admin'])
  @Mutation(() => TranslationType)
  async deleteTranslation(@Args() { id }: DeleteTranslationArgs): Promise<TranslationType> {
    return this.prismaService.translation.delete({
      where: {
        id,
      },
    });
  }
}
