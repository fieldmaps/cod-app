import { scoreHeaders } from './consts.svelte';

class Store {
  sortKey = $state('score');
  sortDirection = $state(1);
  visibleColumns = $state(
    Object.keys(scoreHeaders).reduce((acc, cur) => ({ ...acc, [cur]: true }), {}),
  );
}
export default new Store();
