import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import JwtAccess from '@/auth/decorators/JwtAccess';

import CreateTranslationArgs from '../args/CreateTranslationArgs';
import DeleteTranslationArgs from '../args/DeleteTranslationArgs';
import GetLanguagesArgs from '../args/GetLanguagesArgs';
import GetTranslationsArgs from '../args/GetTranslationsArgs';
import UpdateTranslationArgs from '../args/UpdateTranslationArgs';
import UpsertTranslationArgs from '../args/UpsertTranslationArgs';
import TranslationsService from '../services/TranslationsService';
import TranslationType from '../types/TranslationType';

@Resolver(() => TranslationType)
export default class TranslationsResolver {
  constructor(private readonly translationsService: TranslationsService) {}

  @Query(() => [String])
  async getLanguages(@Args() {}: GetLanguagesArgs): Promise<string[]> {
    return this.translationsService.computeLanguages();
  }

  @Query(() => [TranslationType])
  async getTranslations(@Args() { language }: GetTranslationsArgs): Promise<TranslationType[]> {
    return this.translationsService.findManyByLanguage(language);
  }

  @JwtAccess(['Admin'])
  @Mutation(() => TranslationType)
  async createTranslation(@Args() { input }: CreateTranslationArgs): Promise<TranslationType> {
    return this.translationsService.createTranslation(input);
  }

  @JwtAccess(['Admin'])
  @Mutation(() => TranslationType)
  async updateTranslation(@Args() { input: { id, ...input } }: UpdateTranslationArgs): Promise<TranslationType> {
    return this.translationsService.updateTranslation(id, input);
  }

  @JwtAccess(['Admin'])
  @Mutation(() => Boolean)
  async upsertTranslation(@Args() { input }: UpsertTranslationArgs): Promise<boolean> {
    return this.translationsService.upsertTranslations(input);
  }

  @JwtAccess(['Admin'])
  @Mutation(() => TranslationType)
  async deleteTranslation(@Args() { id }: DeleteTranslationArgs): Promise<TranslationType> {
    return this.translationsService.deleteTranslation(id);
  }
}
