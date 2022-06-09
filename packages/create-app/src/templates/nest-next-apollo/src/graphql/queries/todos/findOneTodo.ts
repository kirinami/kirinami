import { gql } from '@apollo/client';

import type { FindOneTodoArgs } from '@/api/todos/args/find-one-todo.args';

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
