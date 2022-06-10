export type LoginArgs = {
  input: {
    email: string,
    password: string,
  }
}

export type RegisterArgs = {
  input: {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  }
}

export type RefreshArgs = {
  token: string,
}

export type Auth = {
  accessToken: string,
  refreshToken: string,
}
