import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import JwtAccess from '@/auth/decorators/JwtAccess';

import CreateTranslationBody from '../args/bodies/CreateTranslationBody';
import UpdateTranslationBody from '../args/bodies/UpdateTranslationBody';
import UpsertTranslationBody from '../args/bodies/UpsertTranslationBody';
import TranslationsService from '../services/TranslationsService';
import TranslationType from '../types/TranslationType';

@Controller('translations')
@ApiTags('translations')
export default class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get('languages')
  @ApiOperation({ operationId: 'getLanguages' })
  getLanguages() {
    return this.translationsService.computeLanguages();
  }

  @Get(':language')
  @ApiOperation({ operationId: 'getTranslations' })
  async getTranslations(@Param('language') language: string): Promise<TranslationType[]> {
    const translations = await this.translationsService.findManyByLanguage(language);

    return plainToInstance(TranslationType, translations);
  }

  @JwtAccess(['Admin'])
  @Post()
  @ApiOperation({ operationId: 'createTranslation' })
  async createTranslation(@Body() body: CreateTranslationBody): Promise<TranslationType> {
    const translation = await this.translationsService.createTranslation(body);

    return plainToInstance(TranslationType, translation);
  }

  @JwtAccess(['Admin'])
  @Patch(':id')
  @ApiOperation({ operationId: 'updateTranslation' })
  async updateTranslation(@Param('id') id: number, @Body() body: UpdateTranslationBody): Promise<TranslationType> {
    const translation = await this.translationsService.updateTranslation(id, body);

    return plainToInstance(TranslationType, translation);
  }

  @JwtAccess(['Admin'])
  @Put()
  @ApiBody({ type: UpsertTranslationBody, isArray: true })
  @ApiOperation({ operationId: 'upsertTranslations' })
  async upsertTranslations(@Body() body: UpsertTranslationBody[]) {
    return this.translationsService.upsertTranslations(body);
  }

  @JwtAccess(['Admin'])
  @Delete(':id')
  @ApiOperation({ operationId: 'deleteTranslation' })
  async deleteTranslation(@Param('id') id: number): Promise<TranslationType> {
    const translation = await this.translationsService.deleteTranslation(id);

    return plainToInstance(TranslationType, translation);
  }
}
