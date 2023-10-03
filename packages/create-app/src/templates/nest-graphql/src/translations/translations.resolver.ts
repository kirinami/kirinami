import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAccess, Role } from '@/auth/decorators/jwt-access';

import { CreateTranslationInput } from './dto/create-translation.input';
import { UpdateTranslationInput } from './dto/update-translation.input';
import { UpsertTranslationInput } from './dto/upsert-translation.input';
import { TranslationEntity } from './entities/translation.entity';
import { TranslationsService } from './translations.service';

@Resolver()
export class TranslationResolver {
  constructor(private readonly translationsService: TranslationsService) {}

  @Query(() => [String])
  async getAvailableLanguages(): Promise<string[]> {
    return this.translationsService.getAvailableLanguages();
  }

  @Query(() => [TranslationEntity])
  async getTranslationsByLanguage(@Args('language') language: string): Promise<TranslationEntity[]> {
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
  @Mutation(() => TranslationEntity)
  async createTranslation(
    @Args('body', { type: () => CreateTranslationInput }) body: CreateTranslationInput,
  ): Promise<TranslationEntity> {
    return this.translationsService.createTranslation(body);
  }

  @JwtAccess([Role.Admin])
  @Mutation(() => TranslationEntity)
  async updateTranslation(
    @Args('id', { type: () => Int }) id: number,
    @Args('body', { type: () => UpdateTranslationInput }) body: UpdateTranslationInput,
  ): Promise<TranslationEntity> {
    return this.translationsService.updateTranslation(id, body);
  }

  @JwtAccess([Role.Admin])
  @Mutation(() => TranslationEntity)
  async deleteTranslation(@Args('id', { type: () => Int }) id: number): Promise<TranslationEntity> {
    return this.translationsService.deleteTranslation(id);
  }
}
