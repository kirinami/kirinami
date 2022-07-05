import { gql } from '@apollo/client';

import { TODO } from '../../fragments/Todo';

export const UPDATE_TODO = gql`
  ${TODO}

  mutation UpdateTodo($id: Int!, $input: UpdateTodoInput!) {
    updateTodo(id: $id, input: $input) {
      ...Todo
    }
  }
`;
