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
          <td>{format('.0%')(data)}</td>
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
</style>
