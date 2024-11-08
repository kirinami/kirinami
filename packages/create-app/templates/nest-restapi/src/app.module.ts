import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { TranslationsModule } from '@/translations/translations.module';
import { UsersModule } from '@/users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, TranslationsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
