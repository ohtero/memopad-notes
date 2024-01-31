import { useEffect, useState } from 'react';
import { useFetchType, FetchParams, ListItem } from '../typings/types';
import { isList, isListValue, isListValueArray } from '../utils/typeGuard';

export function useFetch({ method, operation, body, listId, itemId }: FetchParams): useFetchType {
  const [data, setData] = useState<useFetchType['data']>([]);
  const [isPending, setIsPending] = useState<useFetchType['isPending']>(false);
  const [error, setError] = useState<useFetchType['error']>(null);
  const [params, setParams] = useState<FetchParams>({
    method: method,
    operation: operation,
    body: body,
    listId: listId,
    itemId: itemId,
  });

  const options = {
    method: params.method,
    headers: {
      'content-type': 'application/json',
    },
    body: params.body ? JSON.stringify(params.body) : null,
  };

  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = apiUrl + '/lists';

  const url = params.itemId ? `${baseUrl}/${params.listId}/${params.itemId}` : params.listId ? `${baseUrl}/${params.listId}` : baseUrl;

  // Allows components to mutate fetch parameters to trigger fetching of different data
  function setFetchParams({ method, operation, body, listId, itemId }: FetchParams) {
    setParams({ method: method, operation: operation, body: body, listId: listId, itemId: itemId });
  }

  useEffect(() => {
    const { method, operation, body, listId, itemId } = params;
    async function fetchData() {
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
    void fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return { data, error, isPending, setFetchParams };
}
