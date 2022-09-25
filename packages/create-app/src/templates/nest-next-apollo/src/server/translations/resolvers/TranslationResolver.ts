import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import JwtAccess from '../../auth/decorators/JwtAccess';
import RolesAccess from '../../auth/decorators/RolesAccess';
import PrismaService from '../../utils/prisma/PrismaService';
import CreateTranslationInput from '../dto/CreateTranslationInput';
import TranslationType from '../dto/TranslationType';
import UpdateTranslationInput from '../dto/UpdateTranslationInput';

@Resolver(() => TranslationType)
export default class TranslationResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query(() => [String])
  async locales() {
    const translations = await this.prismaService.translation.groupBy({
      by: ['locale'],
    });

    return translations.map((translation) => translation.locale);
  }

  @Query(() => [TranslationType])
  async translations(@Args('locale', { nullable: true }) locale?: string) {
    return this.prismaService.translation.findMany({
      where: {
        locale,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  @JwtAccess()
  @Mutation(() => TranslationType)
  async createTranslation(@Args('input') input: CreateTranslationInput) {
    return this.prismaService.translation.create({
      data: input,
    });
  }

  @JwtAccess()
  @Mutation(() => TranslationType)
  async updateTranslation(@Args('input') { id, ...input }: UpdateTranslationInput) {
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
  async upsertTranslation(@Args('input', { type: () => [UpdateTranslationInput] }) input: UpdateTranslationInput[]) {
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

  @JwtAccess()
  @Mutation(() => TranslationType)
  async deleteTranslation(@Args('id', { type: () => Int }) id: number) {
    return this.prismaService.translation.delete({
      where: {
        id,
      },
    });
  }
}
