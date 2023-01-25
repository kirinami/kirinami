import { ArgsType } from '@nestjs/graphql';

import PaginationArgs from '@/common/dto/args/PaginationArgs';

@ArgsType()
export default class GetUsersArgs extends PaginationArgs() {}
