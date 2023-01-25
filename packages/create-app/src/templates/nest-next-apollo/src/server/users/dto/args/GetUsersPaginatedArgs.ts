import { ArgsType } from '@nestjs/graphql';

import PaginatedArgs from '@/server/utils/dto/args/PaginatedArgs';

@ArgsType()
export default class GetUsersPaginatedArgs extends PaginatedArgs() {}
