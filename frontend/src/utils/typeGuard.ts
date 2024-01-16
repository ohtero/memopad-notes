import { ListData, ListItems } from '../typings/types';

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isList(value: ListData[] | string): value is ListData[] {
  return value !== undefined;
}

export function isListValues(value: ListItems[]): value is ListItems[] {
  return value !== undefined;
}
