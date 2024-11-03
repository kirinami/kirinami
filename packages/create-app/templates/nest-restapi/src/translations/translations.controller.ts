import { Body, Controller, Delete, Get, Param, Patch, Post, Put, SerializeOptions } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BearerAccess, Role } from '../auth/decorators/bearer-access';

import { CreateTranslationInput } from './dto/create-translation.input';
import { UpdateTranslationInput } from './dto/update-translation.input';
import { UpsertTranslationInput } from './dto/upsert-translation.input';
import { TranslationModel } from './models/translation.model';
import { TranslationsService } from './services/translations.service';

@ApiTags('translations')
@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @SerializeOptions({
    type: String,
  })
  @Get('available-languages')
  async getAvailableLanguages(): Promise<string[]> {
    return this.translationsService.getAvailableLanguages();
  }

  @SerializeOptions({
    type: TranslationModel,
  })
  @Get(':language')
  async getTranslationsByLanguage(@Param('language') language: string): Promise<TranslationModel[]> {
    return this.translationsService.findManyByLanguage(language);
  }

  @SerializeOptions({
    type: Boolean,
  })
  @BearerAccess([Role.Admin])
  @Put()
  async upsertTranslations(@Body() input: UpsertTranslationInput[]): Promise<boolean> {
    return this.translationsService.upsertTranslations(input);
  }

  @SerializeOptions({
    type: TranslationModel,
  })
  @BearerAccess([Role.Admin])
  @Post()
  async createTranslation(@Body() input: CreateTranslationInput): Promise<TranslationModel> {
    return this.translationsService.createTranslation(input);
  }

  @SerializeOptions({
    type: TranslationModel,
  })
  @BearerAccess([Role.Admin])
  @Patch(':id')
  async updateTranslation(@Param('id') id: number, @Body() input: UpdateTranslationInput): Promise<TranslationModel> {
    return this.translationsService.updateTranslation(id, input);
  }

  @SerializeOptions({
    type: TranslationModel,
  })
  @BearerAccess([Role.Admin])
  @Delete(':id')
  async deleteTranslation(@Param('id') id: number): Promise<TranslationModel> {
    return this.translationsService.deleteTranslation(id);
  }
}
