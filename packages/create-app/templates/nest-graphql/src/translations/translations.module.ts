import { Module } from '@nestjs/common';

import { TranslationResolver } from './resolvers/translation.resolver';
import { TranslationsService } from './services/translations.service';
import { TranslationsResolver } from './translations.resolver';

@Module({
  imports: [],
  providers: [TranslationResolver, TranslationsService, TranslationsResolver],
  exports: [TranslationsService],
})
export class TranslationsModule {}
