import { writable } from 'svelte/store';

export const sortIndex = writable(-1);
export const sortDirection = writable(1);
