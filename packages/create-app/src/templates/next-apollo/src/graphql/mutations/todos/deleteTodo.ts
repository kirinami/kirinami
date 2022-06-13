import { gql } from '@apollo/client';

import { DeleteTodoArgs } from '@/api/graphql/schemas/todos/types';

import { TODO, Todo } from '../../fragments/Todo';

export type DeleteTodoVars = DeleteTodoArgs;

export type DeleteTodoData = {
  deleteTodo: Todo,
};

export const DELETE_TODO = gql`
  ${TODO}

  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      ...Todo
    }
  }
`;
