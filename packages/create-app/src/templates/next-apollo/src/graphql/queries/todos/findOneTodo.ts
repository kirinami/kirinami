import { gql } from '@apollo/client';

import { TODO } from '../../fragments/Todo';

export const FIND_ONE_TODO = gql`
  ${TODO}

  query FindOneTodo($id: Int!) {
    findOneTodo(id: $id) {
      ...Todo
    }
  }
`;
