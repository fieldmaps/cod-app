<script lang="ts">
  import { headers } from '$lib/consts';
  import { getCSVRows } from '$lib/utils';
  import { format } from 'd3-format';
  import { onMount } from 'svelte';

  let headerRow = [];
  let scores = [];
  let sortIndex = 0;
  let sort = 1;

  onMount(async () => {
    const rows = await getCSVRows('tables/scores');
    headerRow = rows[0];
    scores = rows.slice(1);
  });

  function classifyScore(score: number) {
    if (score <= 0.333) return 'low';
    if (score <= 0.667) return 'medium';
    return 'high';
  }

  function onClick(index: number) {
    if (sortIndex === index) {
      sort = sort * -1;
    } else {
      sortIndex = index;
      sort = 1;
    }
    scores = scores.sort((a, b) => {
      if (a[index] < b[index]) return -sort;
      if (a[index] > b[index]) return sort;
      return 0;
    });
  }
</script>

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

<style>
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
