<script lang="ts">
  import { scoreDescriptions, scoreHeaders } from '$lib/consts';
  import { sortDirection, sortKey } from '$lib/stores';
  import { classifyScore, getCodQuality, getCSV, mergeArrays } from '$lib/utils';
  import { format } from 'd3-format';
  import { onMount } from 'svelte';

  let rows = [];

  onMount(async () => {
    const metadata = await getCSV('tables/metadata');
    const scores = await getCSV('tables/scores');
    rows = mergeArrays(metadata, scores, 'iso3');
    onClick();
  });

  function onClick(key?: string) {
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
</script>

<section>
  {#if rows.length}
    <table class="table">
      <tr>
        {#each Object.entries(scoreHeaders) as [key, value]}
          <th on:click={() => onClick(key)} title={scoreDescriptions[key]}>
            {value}
          </th>
        {/each}
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
          {#each Object.keys(scoreHeaders).slice(3) as key}
            <td class={`cell ${classifyScore(row[key] || 0)}`}>
              {format('.0%')(row[key] || 0)}
            </td>
          {/each}
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
