import { Module } from '@nestjs/common';

import { CommonModule } from '@/common/common.module';

import { TranslationsResolver } from './translations.resolver';
import { TranslationsService } from './translations.service';

@Module({
  imports: [CommonModule],
  providers: [TranslationsService, TranslationsResolver],
  exports: [TranslationsService],
})
export class TranslationsModule {}
