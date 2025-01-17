<script lang="ts">
  import { baseURL } from '$lib/consts.svelte';
  import { getCSV } from '$lib/utils.svelte';
  import { onMount } from 'svelte';

  let date = $state(new Date());

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  };

  onMount(async () => {
    date = (await getCSV('tables/date'))[0].date;
  });
</script>

<h1>COD-AB Data Quality</h1>

<section>
  Generated on: {date.toLocaleDateString('en-GB', options)}
</section>

<section>
  <div>
    <a href="https://github.com/mapaction/cod-ab-data-quality">GitHub project</a>
    <br />
    <a href={`${baseURL}/tables/cod_ab_data_quality.xlsx`}>Table as Excel</a>
  </div>
</section>

<section>
  <div>
    <a href={`${baseURL}/tables/metadata.csv`}>metadata.csv</a>,
    <a href={`${baseURL}/tables/checks.csv`}>checks.csv</a>,
    <a href={`${baseURL}/tables/scores.csv`}>scores.csv</a>
  </div>
</section>

<style>
  h1,
  section {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }
</style>
