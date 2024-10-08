<script lang="ts">
  import { scoreDescriptions, scoreHeaders } from '$lib/consts';
  import { sortDirection, sortKey, visibleColumns } from '$lib/stores';
  import { classifyScore, getCodQuality, getCSV, getMean, mergeArrays } from '$lib/utils';
  import { format } from 'd3-format';
  import { onMount } from 'svelte';

  let rows = [];

  onMount(async () => {
    const metadata = await getCSV('tables/metadata');
    const scores = await getCSV('tables/scores');
    rows = mergeArrays(metadata, scores, 'iso3');
    toggleColumn();
  });

  function sortRows(key?: string) {
    if (key) {
      if ($sortKey === key) {
        $sortDirection = -$sortDirection;
      } else {
        $sortKey = key;
        $sortDirection = 1;
      }
    }
    rows = rows.sort((a, b) => {
      const sortA = a[$sortKey] || '';
      const sortB = b[$sortKey] || '';
      if (sortA < sortB) return -$sortDirection;
      if (sortA > sortB) return $sortDirection;
      if (a.iso3 > b.iso3) return 1;
      return 0;
    });
  }

  function toggleColumn() {
    for (const row of rows) {
      const scores = [];
      for (const [key, visible] of Object.entries($visibleColumns)) {
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
      <tr>
        <td /><td /><td />
        {#each Object.keys(scoreHeaders) as key}
          <td class="center" on:click={() => setTimeout(() => toggleColumn(key))}>
            <input type="checkbox" bind:checked={$visibleColumns[key]} />
          </td>
        {/each}
        <td />
      </tr>
      <tr>
        {#each [['name', 'Name'], ['iso3', 'Code'], ['itos_service', 'Status']] as [key, value]}
          <th on:click={() => sortRows(key)}>
            {value}
            {#if $sortKey === key}
              {#if $sortDirection === 1}
                ▲
              {:else if $sortDirection === -1}
                ▼
              {/if}
            {/if}
          </th>
        {/each}
        {#each Object.entries(scoreHeaders) as [key, value]}
          {#if $visibleColumns[key]}
            <th on:click={() => sortRows(key)} title={scoreDescriptions[key]}>
              {value}
              {#if $sortKey === key}
                {#if $sortDirection === 1}
                  ▲
                {:else if $sortDirection === -1}
                  ▼
                {/if}
              {/if}
            </th>
          {:else}
            <td />
          {/if}
        {/each}
        <th on:click={() => sortRows('score')}>
          Score
          {#if $sortKey === 'score'}
            {#if $sortDirection === 1}
              ▲
            {:else if $sortDirection === -1}
              ▼
            {/if}
          {/if}
        </th>
      </tr>
      {#each rows as row}
        <tr>
          <td>{row.name}</td>
          <td>
            {#if row.score}
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
            {#if $visibleColumns[key]}
              <td class={`cell ${classifyScore(row[key] || 0)}`}>
                {format('.0%')(row[key] || 0)}
              </td>
            {:else}
              <td />
            {/if}
          {/each}
          <td class={`cell ${classifyScore(row.score || 0)}`}>
            {format('.0%')(row.score || 0)}
          </td>
        </tr>
      {/each}
    </table>
  {/if}
</section>

<style>
  section {
    margin: 1rem auto;
    overflow: auto;
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
