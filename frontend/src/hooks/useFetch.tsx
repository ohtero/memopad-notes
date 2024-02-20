import { useEffect, useState } from 'react';
import { useFetchType, FetchParams, ListItem } from '../typings/types';
import { isList, isListValue, isListValueArray } from '../utils/typeGuard';

export function useFetch({ method, operation, listId, itemId }: FetchParams): useFetchType {
  const [data, setData] = useState<useFetchType['data']>([]);
  const [isPending, setIsPending] = useState<useFetchType['isPending']>(false);
  const [error, setError] = useState<useFetchType['error']>(null);

  function reFetch({ method, operation, body, listId, itemId }: FetchParams) {
    void fetchData({ method, operation, body, listId, itemId });
  }

  async function fetchData({ method, operation, body, listId, itemId }: FetchParams) {
    const controller = new AbortController();
    const signal = controller.signal;
    const options = {
      method: method,
      signal: signal,
      headers: {
        'content-type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    };

    const apiUrl = import.meta.env.VITE_API_URL;
    let url = `${apiUrl}/lists`;

    if (listId && !itemId) {
      url = `${url}/${listId}`;
    }
    if (itemId) url = `${url}/${listId}/${itemId}`;
    setIsPending(true);

    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const resData = (await res.json()) as useFetchType['data'];
      const result = resData ? resData : [];

      if (method === 'GET') {
        setData(result);
      }
      if (method === 'DELETE') {
        if (operation === 'deleteList' && isList(data)) {
          const newData = data.filter((list) => list.list_id !== listId);
          setData(newData);
        }
        if (operation === 'deleteListItem' && isListValueArray(data)) {
          console.log('deleting list item');
          const newData = data.filter((list) => list.list_item_id !== itemId);
          setData(newData);
        }
      }
      if (method === 'POST') {
        if (operation === 'postListItem' && isListValue(body) && isListValueArray(data)) {
          const newData: ListItem[] = data;
          newData.push(body);
          setData(newData);
        }
      }
    } catch (err) {
      setError(err as string);
    } finally {
      setIsPending(false);
    }
  }

  useEffect(() => {
    void fetchData({ method: method, operation: operation, listId: listId, itemId: itemId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error, isPending, reFetch };
}
