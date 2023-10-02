import { Body, Controller, Delete, Get, Param, Patch, Post, Put, SerializeOptions } from '@nestjs/common';

import { JwtAccess, Role } from '@/auth/decorators/jwt-access';

import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { UpsertTranslationDto } from './dto/upsert-translation.dto';
import { TranslationEntity } from './entities/translation.entity';
import { TranslationsService } from './translations.service';

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
    type: TranslationEntity,
  })
  @Get(':language')
  async getTranslationsByLanguage(@Param('language') language: string): Promise<TranslationEntity[]> {
    return this.translationsService.findManyByLanguage(language);
  }

  @SerializeOptions({
    type: Boolean,
  })
  @JwtAccess([Role.Admin])
  @Put()
  async upsertTranslations(@Body() body: UpsertTranslationDto[]): Promise<boolean> {
    return this.translationsService.upsertTranslations(body);
  }

  @SerializeOptions({
    type: TranslationEntity,
  })
  @JwtAccess([Role.Admin])
  @Post()
  async createTranslation(@Body() body: CreateTranslationDto): Promise<TranslationEntity> {
    return this.translationsService.createTranslation(body);
  }

  @SerializeOptions({
    type: TranslationEntity,
  })
  @JwtAccess([Role.Admin])
  @Patch(':id')
  async updateTranslation(@Param('id') id: number, @Body() body: UpdateTranslationDto): Promise<TranslationEntity> {
    return this.translationsService.updateTranslation(id, body);
  }

  @SerializeOptions({
    type: TranslationEntity,
  })
  @JwtAccess([Role.Admin])
  @Delete(':id')
  async deleteTranslation(@Param('id') id: number): Promise<TranslationEntity> {
    return this.translationsService.deleteTranslation(id);
  }
}
