export default function request<T>(method: string, url: string, body?: unknown) {
  return fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUzNDY3MTg2LCJleHAiOjE2NTQwNzE5ODZ9.K_WzbUMxTRxrC18vDrPWBmwiYSnZgoFW3Zx-TbYEFHA',
    },
    credentials: 'same-origin',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json() as Promise<T>;
    });
}
