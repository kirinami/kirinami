import { Module } from '@nestjs/common';

import { CommonModule } from '@/common/common.module';

import { TranslationResolver } from './translations.resolver';
import { TranslationsService } from './translations.service';

@Module({
  imports: [CommonModule],
  providers: [TranslationsService, TranslationResolver],
  exports: [TranslationsService],
})
export class TranslationsModule {}
