<script lang="ts">
  import { scoreDescriptions, scoreHeaders } from '$lib/consts';
  import { sortDirection, sortIndex } from '$lib/stores';
  import { classifyScore, getCSVRows } from '$lib/utils';
  import { format } from 'd3-format';
  import { onMount } from 'svelte';

  let headerRow = [];
  let scores = [];

  onMount(async () => {
    const rows = await getCSVRows('tables/scores');
    headerRow = rows[0];
    scores = rows.slice(1);
    onClick();
  });

  function onClick(index?: number) {
    if (typeof index === 'number') {
      if ($sortIndex === index) {
        $sortDirection = -$sortDirection;
      } else {
        $sortIndex = index;
        $sortDirection = 1;
      }
    }
    const sortIdx = $sortIndex >= 0 ? $sortIndex : scores[0].length + $sortIndex;
    scores = scores.sort((a, b) => {
      if (a[sortIdx] < b[sortIdx]) return -$sortDirection;
      if (a[sortIdx] > b[sortIdx]) return $sortDirection;
      if (a[0] > b[0]) return 1;
      return 0;
    });
  }
</script>

<section>
  {#if scores.length}
    <table class="table">
      <tr>
        {#each headerRow as header, index}
          <th on:click={() => onClick(index)} title={scoreDescriptions[header]}>
            {scoreHeaders[header] || header}
          </th>
        {/each}
      </tr>
      {#each scores as score}
        <tr>
          <td>
            <a href={`/report/${score[0].toLowerCase()}`}>
              {score[0]}
            </a>
          </td>
          {#each score.slice(1) as data}
            <td class={`cell ${classifyScore(data)}`}>
              {format('.0%')(data)}
            </td>
          {/each}
        </tr>
      {/each}
    </table>
  {/if}
</section>

<style>
  section {
    margin: auto;
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
