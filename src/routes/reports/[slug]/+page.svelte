<script lang="ts">
  import { page } from '$app/stores';
  import { getCSV } from '$lib/utils';
  import { onMount } from 'svelte';

  const iso3 = $page.params.slug.toUpperCase();
  const today = new Date();

  let metadata = {};
  let checks = [];
  let scores = {};
  let admin_levels = [];
  let levels = -1;

  function get_cod_quality(service: string) {
    if (service === 'COD_External') return 'Enhanced';
    if (service === 'COD_NO_GEOM_CHECK') return 'Standard';
    return 'Not Available';
  }

  function range(stop = 0, start = 0, step = 1) {
    return Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step,
    );
  }

  onMount(async () => {
    const metadataAll = await getCSV('tables/metadata');
    metadata = metadataAll.find((x) => x.iso3 === iso3);
    const checksAll = await getCSV('tables/checks');
    checks = checksAll.filter((x) => x.iso3 === iso3);
    const scoresAll = await getCSV('tables/scores');
    scores = scoresAll.find((x) => x.iso3 === iso3);
    admin_levels = range(metadata.itos_level);
    levels = metadata.itos_level;
  });
</script>

<h2>
  COD-AB Data Quality Report:<br />
  {metadata.name}
</h2>
<p>Generated on: {today}</p>
<div class="img-grid">
  {#each admin_levels as level}
    <div>
      Admin {level}
      <img
        src={`https://cod-data.fieldmaps.io/images/${iso3.toLowerCase()}_adm${level}.png`}
        alt="not available"
      />
    </div>
  {/each}
</div>
<h2>Metadata</h2>
<div class="metadata-grid">
  <div><b>Links:</b></div>
  <div>
    {#if metadata.itos_url}
      <a href={metadata.itos_url}>ITOS</a>
    {/if}
    {#if metadata.hdx_url}
      <a href={metadata.hdx_url}>HDX</a>
    {/if}
  </div>
  <div><b>COD Quality:</b></div>
  <div>{get_cod_quality(metadata.itos_service)}</div>
  <div><b>ISO-3 Code:</b></div>
  <div>{metadata.iso3}</div>
  <div><b>ISO-2 Code:</b></div>
  <div>{metadata.iso2}</div>
  <div><b>Data Contributor:</b></div>
  <div>{metadata.hdx_source_2}</div>
  <div><b>Data Source:</b></div>
  <div>{metadata.hdx_source_1}</div>
  <div><b>Licence:</b></div>
  <div>{metadata.hdx_license}</div>
  <div><b>Error free layers:</b></div>
  <div>
    {scores.error_free * (levels + 1)} of {levels + 1}
  </div>
  <div><b>Overall Score:</b></div>
  <div>{scores.score * 100}%</div>
</div>

<div class="pagebreak" />

<h2>Scores</h2>
<div class="score">
  <div>
    Layers which have valid geometry. Valid geometry is defined by having no empty geometries, only
    containing polygons (no points or lines), not containing any self-intersecting rings, using
    WGS84 CRS (EPSG:4326), and containing no self-overlapping polygons.
  </div>
  <div>
    {scores.geometry_valid * (levels + 1)} of {levels + 1}
  </div>
</div>
<div class="score">
  <div>
    Layers which have perfect hierarchal nesting. Hierarchy is defined by each sub-national unit
    belonging to only a single parent (does not overlap between mutliple higher levels).
  </div>
  <div>
    {scores.geometry_hierarchy * (levels + 1)} of {levels + 1}
  </div>
</div>
<div class="score">
  <div>
    Layers which all share the same geometric bounding box. Layers not sharing the same bounding box
    are partial layers which only cover a sub-section.
  </div>
  <div>
    {scores.geometry_bounds * (levels + 1)} of {levels + 1}
  </div>
</div>
<div class="score">
  <div>
    Layers which all share the same area. Layers not sharing the same area may have empty areas
    representing water bodies whereas other layers have them filled out.
  </div>
  <div>
    {scores.geometry_area * (levels + 1)} of {levels + 1}
  </div>
</div>
<div class="score">
  <div>Layers which have at least 1 language column detected.</div>
  <div>
    {scores.languages * (levels + 1)} of {levels + 1}
  </div>
</div>
<div class="score">
  <div>Layers which have been updated within the last 3 years.</div>
  <div>
    {scores.dates * (levels + 1)} of {levels + 1}
  </div>
</div>

<div class="pagebreak" />

<h2>Checks</h2>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>Admin {level}</div>
  {/each}
</div>
<div>Are there any empty geometries contained within the layer? (Should be No)</div>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>{checks[level]['geom_not_empty'] ? 'No' : 'Yes'}</div>
  {/each}
</div>
<div>Are all geometries in the layer of type polygon? (Should be Yes)</div>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>{checks[level]['geom_is_polygon'] ? 'Yes' : 'No'}</div>
  {/each}
</div>
<div>
  Are all polygons 2 dimensional? In other words, do they contain only XY coordinates and no Z?
  (Should be Yes)
</div>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>{checks[level]['geom_is_polygon'] ? 'Yes' : 'No'}</div>
  {/each}
</div>
<div>Are all geometries valid? (Should be Yes)</div>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>{checks[level]['geom_is_valid'] ? 'Yes' : 'No'}</div>
  {/each}
</div>
<div>If any geometries are invalid, how come?</div>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>{checks[level]['geom_invalid_reason'] || 'N/A'}</div>
  {/each}
</div>
<div>What EPSG projection is used in the layer? (Should be 4326)</div>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>{checks[level]['geom_proj']}</div>
  {/each}
</div>
<div>How large is the layer in square kilometers? (All values should be the same)</div>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>{checks[level]['geom_area_km']}</div>
  {/each}
</div>
<div>How many polygons overlap each other within the same layer? (Should be 0)</div>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>{checks[level]['geom_overlaps_self']}</div>
  {/each}
</div>
<div>
  How many polygons are not hierarchal, meaning they cross the border between two parent boundaries?
  (Should be 0)
</div>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>{checks[level]['geom_overlaps_parent']}</div>
  {/each}
</div>

<div class="pagebreak" />

<h2>Checks</h2>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>Admin {level}</div>
  {/each}
</div>
<div>What percentage of cells are empty?</div>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>
      {(checks[level]['number_of_missing_records'] /
        (checks[level]['total_number_of_records'] || 1)) *
        100}%
    </div>
  {/each}
</div>
<div>What is the date of the dataset's source?</div>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>
      {#each range(checks[level]['date_count']) as idx}
        <div>{new Date(checks[level]['date_' + (idx + 1)])}</div>
      {/each}
      {#if checks[level]['date_count'] === 0}
        <div>No Date</div>
      {/if}
    </div>
  {/each}
</div>
<div>When was the dataset last updated?</div>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>
      {#each range(checks[level]['update_count']) as idx}
        <div>{new Date(checks[level]['update_' + (idx + 1)])}</div>
      {/each}
      {#if checks[level]['update_count'] === 0}
        <div>No Date</div>
      {/if}
    </div>
  {/each}
</div>
<div>What languages are used in the dataset?</div>
<div class="checks-grid checks-grid-{levels}">
  {#each admin_levels as level}
    <div>
      {#each range(checks[level]['language_count']) as idx}
        <span>{checks[level]['language_' + (idx + 1)]}</span>
      {/each}
      {#if checks[level]['language_count'] === 0}
        <div>No Language</div>
      {/if}
    </div>
  {/each}
</div>

<style>
  @page {
    size: A4 portrait;
    margin: 2.5cm;
  }

  @media print {
    .pagebreak {
      page-break-before: always;
    }
  }

  :global(body) {
    font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Segoe UI Symbol';
  }

  .img-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .metadata-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 0.5rem;
  }

  .score {
    margin: 1rem 0;
  }

  .score > div:first-child {
    margin: 1rem 0;
  }

  .checks-grid {
    display: grid;
    margin: 1rem 0;
  }

  .checks-grid-0 {
    grid-template-columns: repeat(1, 1fr);
  }

  .checks-grid-1 {
    grid-template-columns: repeat(2, 1fr);
  }

  .checks-grid-2 {
    grid-template-columns: repeat(3, 1fr);
  }

  .checks-grid-3 {
    grid-template-columns: repeat(4, 1fr);
  }

  .checks-grid-4 {
    grid-template-columns: repeat(5, 1fr);
  }

  .checks-grid-5 {
    grid-template-columns: repeat(6, 1fr);
  }

  img {
    width: 100%;
  }
</style>
