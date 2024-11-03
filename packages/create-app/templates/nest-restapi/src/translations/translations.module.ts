import { Module } from '@nestjs/common';

import { TranslationsService } from './services/translations.service';
import { TranslationsController } from './translations.controller';

@Module({
  imports: [],
  controllers: [TranslationsController],
  providers: [TranslationsService],
  exports: [TranslationsService],
})
export class TranslationsModule {}
