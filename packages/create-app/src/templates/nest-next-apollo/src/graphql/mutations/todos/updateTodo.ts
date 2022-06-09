import { gql } from '@apollo/client';

import type { UpdateTodoArgs } from '@/api/todos/args/update-todo.args';

import { TODO, Todo } from '../../fragments/Todo';

export type UpdateTodoVars = UpdateTodoArgs;

export type UpdateTodoData = {
  updateTodo: Todo,
};

export const UPDATE_TODO = gql`
  ${TODO}

  mutation UpdateTodo($id: Int!, $input: UpdateTodoInput!) {
    updateTodo(id: $id, input: $input) {
      ...Todo
    }
  }
`;
