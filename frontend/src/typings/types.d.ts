export interface ListData {
  list_id: number;
  list_name: string;
}

export interface ListItem {
  list_item_id: string;
  list_item_value: string;
  completed: boolean;
}

export type useFetchType = {
  data: ListData[] | ListItem[] | [];
  isPending: boolean;
  error: string | null;
  reFetch: (params: FetchParams) => void;
};

export type FetchParams = {
  method?: string;
  operation?: keyof ApiOperations;
  body?: ListItem;
  listId?: number;
  itemId?: string;
};

export type ApiOperations = {
  getLists: string;
  getSingleList: string;
  deleteList: string;
  deleteListItem: string;
  createList: string;
  postListItem: string;
};
