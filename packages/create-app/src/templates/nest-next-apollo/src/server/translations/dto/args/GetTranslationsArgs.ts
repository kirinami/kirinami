import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export default class GetTranslationsArgs {
  @Field({ nullable: true })
  locale!: string | null;
}
