import { ObjectType } from '@nestjs/graphql';

import PaginationType from '@/common/types/PaginationType';

import UserType from '../UserType';

@ObjectType()
export default class UsersPaginationType extends PaginationType(UserType) {}
