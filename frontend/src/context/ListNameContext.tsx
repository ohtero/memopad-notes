import { useContext, createContext, PropsWithChildren, useState } from 'react';

const defaultListNameContext = {
  targetListData: null,
  updateListNameContext: () => {},
};

type TargetListType = { listId: number; listName: string } | null;

type ContextTypes = {
  targetListData: TargetListType;
  updateListNameContext: (data: TargetListType) => void;
};

const listNameContext = createContext<ContextTypes>(defaultListNameContext);

export const useListNameContext = () => useContext(listNameContext);

export function ListNameProvider({ children }: PropsWithChildren) {
  const [targetListData, setTargetListData] = useState<TargetListType>(null);

  function updateListNameContext(data: TargetListType) {
    if (data) {
      setTargetListData({ listId: data.listId, listName: data.listName });
    }
  }

  return <listNameContext.Provider value={{ targetListData, updateListNameContext }}>{children}</listNameContext.Provider>;
}
