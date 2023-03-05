import { Module } from '@nestjs/common';

import CommonModule from '@/common/CommonModule';

import TranslationsController from './controllers/TranslationsController';
import TranslationsService from './services/TranslationsService';

@Module({
  imports: [CommonModule],
  providers: [TranslationsService],
  controllers: [TranslationsController],
  exports: [TranslationsService],
})
export default class TranslationsModule {}
