export interface ListContextProps {
  listData: ListData[];
  addListData: (data: ListData[]) => void;
  updateListData: (data: ListData[]) => void;
}
