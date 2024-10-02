import { writable } from 'svelte/store';
import { scoreHeaders } from './consts';

export const sortKey = writable('score');
export const sortDirection = writable(1);
export const visibleColumns = writable(
  Object.keys(scoreHeaders).reduce((acc, cur) => ({ ...acc, [cur]: true }), {}),
);
