import { gql } from '@apollo/client';

import { TODO } from '../../fragments/Todo';

export const DELETE_TODO = gql`
  ${TODO}

  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      ...Todo
    }
  }
`;
