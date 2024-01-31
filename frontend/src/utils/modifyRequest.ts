type ResponseObject<T> = {
  success: boolean;
  error: string;
  data: T | null;
};

const defOptions = {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
};

export async function modifyRequest<T>(url: string, options: RequestInit = defOptions): Promise<ResponseObject<T>> {
  const response: ResponseObject<T> = { success: false, error: '', data: null };
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const result = (await res.json()) as ResponseObject<T>['data'];
    response.success = true;
    response.data = result ? result : null;
  } catch (err) {
    response.error = err as string;
  }
  return response;
}
