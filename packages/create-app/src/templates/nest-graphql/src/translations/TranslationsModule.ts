import { Module } from '@nestjs/common';

import CommonModule from '@/common/CommonModule';

import TranslationsResolver from './resolvers/TranslationsResolver';
import TranslationsService from './services/TranslationsService';

@Module({
  imports: [CommonModule],
  providers: [TranslationsResolver, TranslationsService],
  exports: [TranslationsService],
})
export default class TranslationsModule {}
