export type GetTodosArgs = {
  my?: boolean,
}

export type GetTodoByArgs = {
  id: number
}

export type CreateTodoArgs = {
  input: {
    userId: number,
    title: string,
    completed: boolean,
  }
}

export type UpdateTodoArgs = {
  id: number,
  input: Partial<CreateTodoArgs['input']>
}

export type DeleteTodoArgs = {
  id: number,
}
