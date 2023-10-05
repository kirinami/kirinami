import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAccess, Role } from '@/auth/decorators/jwt-access';

import { CreateTranslationInput } from './dto/create-translation.input';
import { UpdateTranslationInput } from './dto/update-translation.input';
import { UpsertTranslationInput } from './dto/upsert-translation.input';
import { TranslationModel } from './models/translation.model';
import { TranslationsService } from './translations.service';

@Resolver()
export class TranslationsResolver {
  constructor(private readonly translationsService: TranslationsService) {}

  @Query(() => [String])
  async getAvailableLanguages(): Promise<string[]> {
    return this.translationsService.getAvailableLanguages();
  }

  @Query(() => [TranslationModel])
  async getTranslationsByLanguage(@Args('language') language: string): Promise<TranslationModel[]> {
    return this.translationsService.findManyByLanguage(language);
  }

  @JwtAccess([Role.Admin])
  @Mutation(() => Boolean)
  async upsertTranslations(
    @Args('body', { type: () => [UpsertTranslationInput] }) body: UpsertTranslationInput[],
  ): Promise<boolean> {
    return this.translationsService.upsertTranslations(body);
  }

  @JwtAccess([Role.Admin])
  @Mutation(() => TranslationModel)
  async createTranslation(
    @Args('body', { type: () => CreateTranslationInput }) body: CreateTranslationInput,
  ): Promise<TranslationModel> {
    return this.translationsService.createTranslation(body);
  }

  @JwtAccess([Role.Admin])
  @Mutation(() => TranslationModel)
  async updateTranslation(
    @Args('id', { type: () => Int }) id: number,
    @Args('body', { type: () => UpdateTranslationInput }) body: UpdateTranslationInput,
  ): Promise<TranslationModel> {
    return this.translationsService.updateTranslation(id, body);
  }

  @JwtAccess([Role.Admin])
  @Mutation(() => TranslationModel)
  async deleteTranslation(@Args('id', { type: () => Int }) id: number): Promise<TranslationModel> {
    return this.translationsService.deleteTranslation(id);
  }
}
