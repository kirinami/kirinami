import { gql } from '@apollo/client';

import type { RemoveTodoArgs } from '@/api/todos/args/remove-todo.args';

import { TODO, Todo } from '../../fragments/Todo';

export type RemoveTodoVars = RemoveTodoArgs;

export type RemoveTodoData = {
  removeTodo: Todo,
};

export const REMOVE_TODO = gql`
  ${TODO}

  mutation RemoveTodo($id: Int!) {
    removeTodo(id: $id) {
      ...Todo
    }
  }
`;
