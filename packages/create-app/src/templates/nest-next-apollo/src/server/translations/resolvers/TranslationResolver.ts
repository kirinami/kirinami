import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import JwtAccess from '@/server/auth/decorators/JwtAccess';
import RolesAccess from '@/server/auth/decorators/RolesAccess';
import PrismaService from '@/server/utils/services/PrismaService';

import CreateTranslationArgs from '../dto/args/CreateTranslationArgs';
import DeleteTranslationArgs from '../dto/args/DeleteTranslationArgs';
import GetLocalesArgs from '../dto/args/GetLocalesArgs';
import GetTranslationsArgs from '../dto/args/GetTranslationsArgs';
import UpdateTranslationArgs from '../dto/args/UpdateTranslationArgs';
import UpsertTranslationArgs from '../dto/args/UpsertTranslationArgs';
import TranslationType from '../dto/types/TranslationType';

@Resolver(() => TranslationType)
export default class TranslationResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query(() => [String])
  async getLocales(@Args() {}: GetLocalesArgs): Promise<string[]> {
    const translations = await this.prismaService.translation.groupBy({
      by: ['locale'],
    });

    return translations.map((translation) => translation.locale);
  }

  @Query(() => [TranslationType])
  async getTranslations(@Args() { locale }: GetTranslationsArgs): Promise<TranslationType[]> {
    return this.prismaService.translation.findMany({
      where: {
        locale: locale || undefined,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  @RolesAccess(['Admin'])
  @JwtAccess()
  @Mutation(() => TranslationType)
  async createTranslation(@Args() { input }: CreateTranslationArgs): Promise<TranslationType> {
    return this.prismaService.translation.create({
      data: input,
    });
  }

  @RolesAccess(['Admin'])
  @JwtAccess()
  @Mutation(() => TranslationType)
  async updateTranslation(@Args() { input: { id, ...input } }: UpdateTranslationArgs): Promise<TranslationType> {
    return this.prismaService.translation.update({
      where: {
        id,
      },
      data: input,
    });
  }

  @RolesAccess(['Admin'])
  @JwtAccess()
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

  @RolesAccess(['Admin'])
  @JwtAccess()
  @Mutation(() => TranslationType)
  async deleteTranslation(@Args() { id }: DeleteTranslationArgs): Promise<TranslationType> {
    return this.prismaService.translation.delete({
      where: {
        id,
      },
    });
  }
}
