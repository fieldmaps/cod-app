<script lang="ts">
  import { scoreDescriptions, scoreHeaders } from '$lib/consts.svelte';
  import store from '$lib/stores.svelte';
  import { classifyScore, getCodQuality, getCSV, getMean, mergeArrays } from '$lib/utils.svelte';
  import { format } from 'd3-format';
  import { onMount } from 'svelte';

  let rows = $state([]);

  onMount(async () => {
    const metadata = await getCSV('tables/metadata');
    const scores = await getCSV('tables/scores');
    rows = mergeArrays(metadata, scores, 'iso3');
    toggleColumn();
  });

  function sortRows(key?: string) {
    if (key) {
      if (store.sortKey === key) {
        store.sortDirection = -store.sortDirection;
      } else {
        store.sortKey = key;
        store.sortDirection = 1;
      }
    }
    rows = rows.sort((a, b) => {
      const sortA = a[store.sortKey] || '';
      const sortB = b[store.sortKey] || '';
      if (sortA < sortB) return -store.sortDirection;
      if (sortA > sortB) return store.sortDirection;
      if (a.iso3 > b.iso3) return 1;
      return 0;
    });
  }

  function toggleColumn() {
    for (const row of rows) {
      const scores = [];
      for (const [key, visible] of Object.entries(store.visibleColumns)) {
        if (visible) scores.push(row[key]);
      }
      row.score = getMean(scores);
    }
    sortRows();
  }
</script>

<section>
  {#if rows.length}
    <table class="table">
      <thead>
        <tr>
          <td></td><td></td><td></td>
          {#each Object.keys(scoreHeaders) as key}
            <td class="center" onclick={() => setTimeout(() => toggleColumn(key))}>
              <input type="checkbox" bind:checked={store.visibleColumns[key]} />
            </td>
          {/each}
          <td></td>
        </tr>
        <tr>
          {#each [['name', 'Name'], ['iso3', 'Code'], ['itos_service', 'Status']] as [key, value]}
            <th onclick={() => sortRows(key)}>
              {value}
              {#if store.sortKey === key}
                {#if store.sortDirection === 1}
                  ▲
                {:else if store.sortDirection === -1}
                  ▼
                {/if}
              {/if}
            </th>
          {/each}
          {#each Object.entries(scoreHeaders) as [key, value]}
            {#if store.visibleColumns[key]}
              <th onclick={() => sortRows(key)} title={scoreDescriptions[key]}>
                {value}
                {#if store.sortKey === key}
                  {#if store.sortDirection === 1}
                    ▲
                  {:else if store.sortDirection === -1}
                    ▼
                  {/if}
                {/if}
              </th>
            {:else}
              <td></td>
            {/if}
          {/each}
          <th onclick={() => sortRows('score')}>
            Score
            {#if store.sortKey === 'score'}
              {#if store.sortDirection === 1}
                ▲
              {:else if store.sortDirection === -1}
                ▼
              {/if}
            {/if}
          </th>
        </tr>
      </thead>
      <tbody>
        {#each rows as row}
          <tr>
            <td>{row.name}</td>
            <td>
              {#if row.itos_service}
                <a href={`/report/${row.iso3.toLowerCase()}`}>
                  {row.iso3}
                </a>
              {:else}
                {row.iso3}
              {/if}
            </td>
            <td
              class:low={row.itos_service === null}
              class:medium={row.itos_service === 'COD_NO_GEOM_CHECK'}
            >
              {getCodQuality(row.itos_service)}
            </td>
            {#each Object.keys(scoreHeaders) as key}
              {#if store.visibleColumns[key]}
                <td class={`cell ${classifyScore(row[key] || 0)}`}>
                  {format('.0%')(row[key] || 0)}
                </td>
              {:else}
                <td></td>
              {/if}
            {/each}
            <td class={`cell ${classifyScore(row.score || 0)}`}>
              {format('.0%')(row.score || 0)}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>

<style>
  section {
    margin: 1rem auto;
    overflow: auto;
    padding-bottom: 5rem;
  }
  table {
    margin: auto;
    border-spacing: 1rem 0.25rem;
  }
  th {
    cursor: pointer;
  }
  .cell {
    text-align: right;
  }
  .center {
    text-align: center;
  }
  .low {
    background-color: #ffc7ce;
  }
  .medium {
    background-color: #ffcc99;
  }
  .high {
    background-color: #ffeb9c;
  }
</style>
