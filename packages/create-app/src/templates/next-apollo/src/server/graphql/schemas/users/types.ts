export type FindAllUsersArgs = {
  search?: string,
  page?: number,
  size?: number,
};

export type FindOneUserArgs = {
  id?: number,
};

export type CreateUserArgs = {
  input: {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    roles?: string[],
  },
};

export type UpdateUserArgs = {
  id: number,
  input: Partial<CreateUserArgs['input']>,
};

export type DeleteUserArgs = {
  id: number,
};