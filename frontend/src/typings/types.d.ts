export interface ListData {
  list_id: number;
  list_name: string;
}

export interface ListItem {
  list_item_id: string;
  list_item_value: string;
  completed: boolean;
}
