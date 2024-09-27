<script lang="ts">
  import { headers } from '$lib/consts';
  import { getCSVRows } from '$lib/utils';
  import { format } from 'd3-format';
  import { onMount } from 'svelte';

  let headerRow = [];
  let scores = [];
  onMount(async () => {
    const rows = await getCSVRows('tables/scores');
    headerRow = rows[0];
    scores = rows.slice(1);
  });

  function classifyScore(score: number) {
    if (score < 1 / 3) return 'low';
    if (score < 2 / 3) return 'medium';
    return 'high';
  }
</script>

{#if scores.length}
  <table class="table">
    <tr>
      {#each headerRow as header}
        <th>{headers[header] || header}</th>
      {/each}
    </tr>
    {#each scores as score}
      <tr>
        <td><a href={`/reports/${score[0].toLowerCase()}`}>{score[0]}</a></td>
        {#each score.slice(1) as data}
          <td class={classifyScore(data)}>{format('.0%')(data)}</td>
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
