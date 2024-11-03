import { Resolver, Subscription } from '@nestjs/graphql';

import { BearerAccess, Role } from '@/auth/decorators/bearer-access';

import { TranslationModel } from '../models/translation.model';
import { TranslationsService } from '../services/translations.service';

@Resolver(() => TranslationModel)
export class TranslationResolver {
  constructor(private readonly translationsService: TranslationsService) {}

  @BearerAccess([Role.Admin])
  @Subscription(() => String)
  translationAdded() {
    return this.translationsService.pubSub.asyncIterator('translationAdded');
  }
}
