import { Module } from '@nestjs/common';

import TranslationResolver from './resolvers/TranslationResolver';

@Module({
  providers: [TranslationResolver],
  exports: [TranslationResolver],
})
export default class TranslationsModule {}
