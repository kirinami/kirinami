import { gql } from '@apollo/client';

import type { CreateTodoArgs } from '@/api/todos/args/create-todo.args';

import { TODO, Todo } from '../../fragments/Todo';

export type CreateTodoVars = CreateTodoArgs;

export type CreateTodoData = {
  createTodo: Todo,
};

export const CREATE_TODO = gql`
  ${TODO}

  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      ...Todo
    }
  }
`;
