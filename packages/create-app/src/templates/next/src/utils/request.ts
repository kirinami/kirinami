export const headers = {
  Authorization: '',
};

export default function request<T>(method: string, url: string, body?: unknown) {
  return fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method,
    body: JSON.stringify(body),
    headers: {
      ...headers,
      'Content-Type': 'application/json; charset=utf-8',
    },
    credentials: 'same-origin',
  })
    .then(async (response) => {
      if (!response.ok) {
        let message;

        try {
          const data = await response.json();

          message = data?.message || 'Undefined error occurred';
        } catch (err) {
          message = 'Undefined error occurred';
        }

        throw new Error(message);
      }

      return response.json() as Promise<T>;
    });
}
