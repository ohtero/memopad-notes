import { PropsWithChildren, createContext, useContext, useState, useMemo, useCallback } from 'react';
import { ListData } from '../types';
import { ListContextProps } from './contextTypes';

export const ListContext = createContext<ListContextProps>({
  listData: [],
  updateListData: () => {},
  addListData: () => {},
});

export const useListContext = () => useContext(ListContext);

export function ListProvider({ children }: PropsWithChildren) {
  const [listData, setListData] = useState<ListData[]>([]);

  // * Callback and Memo are used to prevent re-renders on 'ListSelection' page
  const updateListDataCallback = useCallback((data: ListData[]) => {
    setListData(data);
  }, []);

  const addListDataCallback = useCallback((data: ListData[]) => {
    setListData((prevData) => [...prevData, ...data]);
  }, []);

  const contextValue = useMemo<ListContextProps>(() => {
    return { listData, addListData: addListDataCallback, updateListData: updateListDataCallback };
  }, [listData, updateListDataCallback, addListDataCallback]);

  return <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>;
}
