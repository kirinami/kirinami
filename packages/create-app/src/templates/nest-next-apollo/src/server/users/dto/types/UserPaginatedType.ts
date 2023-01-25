import { ObjectType } from '@nestjs/graphql';

import PaginatedType from '@/server/utils/dto/types/PaginatedType';

import UserType from './UserType';

@ObjectType()
export default class UserPaginatedType extends PaginatedType(UserType) {}
