export const headers = {
  Authorization: '',
};

export default function request<T>(method: string, url: string, body?: Record<string, unknown>) {
  return fetch(import.meta.env.VITE_RESTAPI_URL + url, {
    method: method.toUpperCase(),
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
