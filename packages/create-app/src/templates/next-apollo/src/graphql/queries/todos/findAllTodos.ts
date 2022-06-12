import { gql } from '@apollo/client';

import { FindAllTodosArgs } from '@/server/graphql/schemas/todos/types';

import { TODO, Todo } from '../../fragments/Todo';

export type FindAllTodosVars = FindAllTodosArgs;

export type FindAllTodosData = {
  findAllTodos: {
    todos: Todo[],
    total: number,
  },
};

export const FIND_ALL_TODOS = gql`
  ${TODO}

  query FindAllTodos($my: Boolean, $page: Int, $size: Int) {
    findAllTodos(my: $my, page: $page, size: $size) {
      todos {
        ...Todo
      }
      total
    }
  }
`;
