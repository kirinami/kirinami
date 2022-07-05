import { gql } from '@apollo/client';

import { TODO } from '../../fragments/Todo';

export const ON_UPDATE_TODO = gql`
  ${TODO}

  subscription OnUpdateTodo {
    onUpdateTodo {
      ...Todo
    }
  }
`;
