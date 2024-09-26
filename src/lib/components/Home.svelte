<script lang="ts">
  import { getCSVRows } from '$lib/utils';
  import { format } from 'd3-format';
  import { onMount } from 'svelte';

  let headers = [];
  let scores = [];
  onMount(async () => {
    const rows = await getCSVRows('tables/scores');
    headers = rows[0];
    scores = rows.slice(1);
  });
</script>

{#if scores.length}
  <table>
    <tr>
      {#each headers as header}
        <th>{header}</th>
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
