import { useContext } from 'react';

import { TodosContext } from '@/components/Provider/TodosProvider/TodosProvider';

export default function useTodos() {
  return useContext(TodosContext);
}
