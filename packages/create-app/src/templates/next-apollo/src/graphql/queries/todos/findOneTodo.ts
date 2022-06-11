import { gql } from '@apollo/client';

import { FindOneTodoArgs } from '@/api/graphql/schemas/todos/types';

import { TODO, Todo } from '../../fragments/Todo';

export type FindOneTodoVars = FindOneTodoArgs;

export type FindOneTodoData = {
  findOneTodo: Todo,
};

export const FIND_ONE_TODO = gql`
  ${TODO}

  query FindOneTodo($id: Int!) {
    findOneTodo(id: $id) {
      ...Todo
    }
  }
`;
