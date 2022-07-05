import { gql } from '@apollo/client';

import { TODO } from '../../fragments/Todo';

export const CREATE_TODO = gql`
  ${TODO}

  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      ...Todo
    }
  }
`;
