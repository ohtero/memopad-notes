export async function fetchData<T>(url: string, options?: object): Promise<T | undefined> {
  let data;
  try {
    const res = await fetch(url, options);
    if (res.ok) {
      data = res.json() as T;
    }
  } catch (err) {
    console.error('Error fetching data: ', err);
  }
  return data;
}
