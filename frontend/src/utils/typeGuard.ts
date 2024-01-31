import { ListData, ListItem } from '../typings/types';

type ListTypes = ListData[] | ListItem[];

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isList(value: ListTypes): value is ListData[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'object' && 'list_id' in item);
}

export function isListValue(value?: ListItem): value is ListItem {
  return value?.list_item_id !== undefined;
}

export function isListValueArray(value: ListTypes): value is ListItem[] {
  return Array.isArray(value) && value.every((item) => 'list_item_id' in item);
}
