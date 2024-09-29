import { writable } from 'svelte/store';

export const sortKey = writable('score');
export const sortDirection = writable(1);
