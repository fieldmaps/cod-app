<script lang="ts">
  import { headers } from '$lib/consts';
  import { sortDirection, sortIndex } from '$lib/stores';
  import { getCSVRows } from '$lib/utils';
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

  function classifyScore(score: number) {
    if (score <= 0.333) return 'low';
    if (score <= 0.667) return 'medium';
    return 'high';
  }

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
          <th on:click={() => onClick(index)}>
            {headers[header] || header}
          </th>
        {/each}
      </tr>
      {#each scores as score}
        <tr>
          <td>
            <a href={`/reports/${score[0].toLowerCase()}`}>
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
    display: flex;
    justify-content: center;
  }
  table {
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
    color: #9c0006;
  }
  .medium {
    background-color: #ffeb9c;
    color: #9c6500;
  }
  .high {
    background-color: #c6efce;
    color: #006100;
  }
</style>
