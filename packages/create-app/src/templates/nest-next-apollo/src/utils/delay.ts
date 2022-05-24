import Todo from '../types/Todo';

const delay = (ms = 500) => new Promise<Todo>((resolve) => {
  setTimeout(resolve, ms);
});

export default delay;
