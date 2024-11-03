import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { BearerAccess, Role } from '../auth/decorators/bearer-access';

import { CreateTranslationInput } from './dto/create-translation.input';
import { UpdateTranslationInput } from './dto/update-translation.input';
import { UpsertTranslationInput } from './dto/upsert-translation.input';
import { TranslationModel } from './models/translation.model';
import { TranslationsService } from './services/translations.service';

@Resolver()
export class TranslationsResolver {
  constructor(private readonly translationsService: TranslationsService) {}

  @Query(() => [String])
  async languages(): Promise<string[]> {
    return this.translationsService.getAvailableLanguages();
  }

  @Query(() => [TranslationModel])
  async translations(@Args('language') language: string): Promise<TranslationModel[]> {
    return this.translationsService.findManyByLanguage(language);
  }

  @BearerAccess([Role.Admin])
  @Mutation(() => Boolean)
  async upsertTranslations(
    @Args('inputs', { type: () => [UpsertTranslationInput] }) inputs: UpsertTranslationInput[],
  ): Promise<boolean> {
    return this.translationsService.upsertTranslations(inputs);
  }

  @BearerAccess([Role.Admin])
  @Mutation(() => TranslationModel)
  async createTranslation(
    @Args('input', { type: () => CreateTranslationInput }) input: CreateTranslationInput,
  ): Promise<TranslationModel> {
    const translation = await this.translationsService.createTranslation(input);

    await this.translationsService.pubSub.publish('translationAdded', {
      translationAdded: translation.createdAt,
    });

    return translation;
  }

  @BearerAccess([Role.Admin])
  @Mutation(() => TranslationModel)
  async updateTranslation(
    @Args('id', { type: () => Int }) id: number,
    @Args('input', { type: () => UpdateTranslationInput }) input: UpdateTranslationInput,
  ): Promise<TranslationModel> {
    return this.translationsService.updateTranslation(id, input);
  }

  @BearerAccess([Role.Admin])
  @Mutation(() => TranslationModel)
  async deleteTranslation(@Args('id', { type: () => Int }) id: number): Promise<TranslationModel> {
    return this.translationsService.deleteTranslation(id);
  }
}
