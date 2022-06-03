import { gql } from '@apollo/client';

import { TODO, Todo } from '../../fragments/Todo';

export type TodosDeleteMutation = {
  todo: Todo,
};

export type TodosDeleteInput = {
  id: number,
};

export const TODOS_DELETE_MUTATION = gql`
  ${TODO}

  mutation TodosDelete($id: Float!) {
    todo: todosDelete(id: $id) {
      ...Todo
    }
  }
`;
