import { ArgsType } from '@nestjs/graphql';

import PaginationArgs from '@/common/args/PaginationArgs';

@ArgsType()
export default class GetUsersArgs extends PaginationArgs() {}
