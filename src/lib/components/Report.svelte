<script lang="ts">
  import { page } from '$app/stores';
  import { checkDescriptions, scoreDescriptions, scoreHeaders } from '$lib/consts';
  import { classifyScore, getCSV, getCodQuality, range } from '$lib/utils';
  import { format } from 'd3-format';
  import { onMount } from 'svelte';

  const iso3 = $page.params.slug.toUpperCase();
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  };

  let metadata = {};
  let checks = [];
  let scores = {};
  let date = new Date();
  let admin_levels = [];
  let levels = -1;

  onMount(async () => {
    const metadataAll = await getCSV('tables/metadata');
    metadata = metadataAll.find((x) => x.iso3 === iso3);
    const checksAll = await getCSV('tables/checks');
    checks = checksAll.filter((x) => x.iso3 === iso3);
    const scoresAll = await getCSV('tables/scores');
    scores = scoresAll.find((x) => x.iso3 === iso3);
    date = (await getCSV('tables/date'))[0].date;
    admin_levels = range(metadata.itos_level);
    levels = metadata.itos_level;
  });
</script>

<svelte:head>
  <title>{metadata.name} - Report | FieldMaps</title>
</svelte:head>

<main>
  <section>
    <a class="no-print" href="/">Home</a>
    <h2>
      COD-AB Data Quality Report:<br />
      {metadata.name}
    </h2>
    <p>Generated on: {date.toLocaleDateString('en-GB', options)}</p>
    <div class="img-grid">
      {#each admin_levels as level}
        <div>
          <div>Admin {level}</div>
          <a href={`https://cod-data.fieldmaps.io/images/${iso3.toLowerCase()}_adm${level}.png`}>
            <img
              src={`https://cod-data.fieldmaps.io/images/${iso3.toLowerCase()}_adm${level}.png`}
              alt="not available"
            />
          </a>
        </div>
      {/each}
    </div>
  </section>

  <div class="pagebreak" />

  <section>
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
      <div><b>Downloads:</b></div>
      <div>
        {#each admin_levels as level}
          <a
            href={`https://cod-data.fieldmaps.io/boundaries/${iso3.toLowerCase()}_adm${level}.gpkg`}
          >
            {`Admin ${level}`}
          </a>&nbsp;
        {/each}
      </div>
      <div><b>COD Quality:</b></div>
      <div class:medium={metadata.itos_service !== 'COD_External'}>
        {getCodQuality(metadata.itos_service)}
      </div>
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
    </div>
  </section>

  <div class="pagebreak" />

  <section>
    <h2>Scores</h2>
    <div class="score-grid">
      <div><b>Overall Score</b>: Takes the average value of all the below.</div>
      <div class={classifyScore(scores.score)}>{format('.0%')(scores.score)}</div>
      {#each Object.entries(scoreDescriptions) as [key, value]}
        <div>
          <b>{scoreHeaders[key]}</b>: {value}
        </div>
        <div class={classifyScore(scores[key])}>
          {format('.0')(scores[key] * (levels + 1))} of {levels + 1}
        </div>
      {/each}
    </div>
  </section>

  <div class="pagebreak" />

  <section>
    <h2>Checks</h2>
    <div class="check-grid" style="--levels: {levels + 1}">
      <div />
      {#each admin_levels as level}
        <div><b>Admin {level}</b></div>
      {/each}

      <div><b>{scoreHeaders.geometry_valid}</b></div>
      {#each admin_levels as _}<div />{/each}

      <div>{checkDescriptions['geom_count']}</div>
      {#each admin_levels as level}
        <div
          class:low={level === 0 ? checks[level]['geom_count'] !== 1 : !checks[level]['geom_count']}
        >
          {format(',.0f')(checks[level]['geom_count'])}
        </div>
      {/each}

      <div>{checkDescriptions['geom_empty']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['geom_empty']}>
          {format(',.0f')(checks[level]['geom_empty'])}
        </div>
      {/each}

      <div>{checkDescriptions['geom_not_polygon']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['geom_not_polygon']}>
          {format(',.0f')(checks[level]['geom_not_polygon'])}
        </div>
      {/each}

      <div>{checkDescriptions['geom_has_z']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['geom_has_z']}>
          {format(',.0f')(checks[level]['geom_has_z'])}
        </div>
      {/each}

      <div>{checkDescriptions['geom_invalid']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['geom_invalid']}>
          {format(',.0f')(checks[level]['geom_invalid'])}
        </div>
      {/each}

      <div>{checkDescriptions['geom_invalid_reason']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['geom_invalid_reason']}>
          {checks[level]['geom_invalid_reason'] || ''}
        </div>
      {/each}

      <div>{checkDescriptions['geom_proj']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['geom_proj'] !== 4326}>
          {checks[level]['geom_proj'] || 'N/A'}
        </div>
      {/each}

      <div>{checkDescriptions['geom_min_max_x_y']}</div>
      {#each admin_levels as level}
        {@const validGap =
          checks[level]['geom_min_x'] >= -180 &&
          checks[level]['geom_min_y'] >= -90 &&
          checks[level]['geom_max_x'] <= 180 &&
          checks[level]['geom_max_y'] <= 90}
        <div class:low={!validGap}>
          {!validGap ? 'Yes' : 'No'}
        </div>
      {/each}

      <div><b>{scoreHeaders.geometry_topology}</b></div>
      {#each admin_levels as _}<div />{/each}

      <div>{checkDescriptions['geom_gaps']}</div>
      {#each admin_levels as level}
        {@const validGap =
          checks[level]['geom_gap_area_km'] === null ||
          checks[level]['geom_gap_area_km'] > 0.0001 ||
          checks[level]['geom_gap_thinness'] === null ||
          checks[level]['geom_gap_thinness'] > 0.001}
        <div class:low={!validGap}>
          {!validGap ? 'Yes' : 'No'}
        </div>
      {/each}

      <div>{checkDescriptions['geom_overlaps_self']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['geom_overlaps_self']}>
          {checks[level]['geom_overlaps_self'] || 0}
        </div>
      {/each}

      <div>{checkDescriptions['geom_not_within_parent']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['geom_not_within_parent']}>
          {checks[level]['geom_not_within_parent'] || 0}
        </div>
      {/each}

      <div>{checkDescriptions['geom_not_within_pcode']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['geom_not_within_pcode']}>
          {checks[level]['geom_not_within_pcode'] || 0}
        </div>
      {/each}

      <div><b>{scoreHeaders.geometry_area}</b></div>
      {#each admin_levels as _}<div />{/each}

      <div>{checkDescriptions['geom_bounds']}</div>
      {#each admin_levels as _}
        {@const equal =
          new Set(
            checks.map((x) => [x.geom_min_x, x.geom_min_y, x.geom_max_x, x.geom_max_y].join(',')),
          ).size === 1}
        <div class:low={!equal}>
          {equal ? 'Yes' : 'No'}
        </div>
      {/each}

      <div>{checkDescriptions['geom_area_km']}</div>
      {#each admin_levels as level}
        <div class:low={new Set(checks.map((x) => x.geom_area_km)).size > 1}>
          {format(',.0f')(checks[level]['geom_area_km'])}
        </div>
      {/each}

      <div><b>{scoreHeaders.table_pcodes}</b></div>
      {#each admin_levels as _}<div />{/each}

      <div>{checkDescriptions['pcode_column_levels']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['pcode_column_levels'] !== level + 1}>
          {checks[level]['pcode_column_levels']}
        </div>
      {/each}

      <div>{checkDescriptions['pcode_empty']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['pcode_empty']}>
          {checks[level]['pcode_empty']}
        </div>
      {/each}

      <div>{checkDescriptions['pcode_not_iso2']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['pcode_not_iso2']}>
          {checks[level]['pcode_not_iso2']}
        </div>
      {/each}

      <div>{checkDescriptions['pcode_not_nested']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['pcode_not_nested']}>
          {checks[level]['pcode_not_nested']}
        </div>
      {/each}

      <div><b>{scoreHeaders.table_names}</b></div>
      {#each admin_levels as _}<div />{/each}

      <div>{checkDescriptions['name_column_levels']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['name_column_levels'] !== level + 1}>
          {checks[level]['name_column_levels']}
        </div>
      {/each}

      <div>{checkDescriptions['name_column_count']}</div>
      {#each admin_levels as level}
        <div
          class:low={!checks[level]['name_column_count'] ||
            checks[level]['name_column_count'] < checks[level]['language_count'] * (level + 1)}
        >
          {checks[level]['name_column_count']}
        </div>
      {/each}

      <div>{checkDescriptions['name_empty']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['name_empty']}>
          {checks[level]['name_empty']}
        </div>
      {/each}

      <div><b>{scoreHeaders.languages}</b></div>
      {#each admin_levels as _}<div />{/each}

      <div>{checkDescriptions['languages']}</div>
      {#each admin_levels as level}
        <div
          class:low={!checks[level]['language_count'] ||
            checks[level]['language_count'] !== checks[level]['language_min']}
        >
          {#each range(checks[level]['language_count'] - 1) as idx}
            {@const lang = new Intl.DisplayNames('en', { type: 'language' }).of(
              checks[level]['language_' + (idx + 1)],
            )}
            <div class:low={lang === checks[level]['language_' + (idx + 1)]}>
              {lang}
            </div>
          {/each}
          {#if checks[level]['language_count'] === 0}
            <div>No Language</div>
          {/if}
        </div>
      {/each}

      <div><b>{scoreHeaders.date}</b></div>
      {#each admin_levels as _}<div />{/each}

      <div>{checkDescriptions['date']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['date_count'] !== 1}>
          {#each range(checks[level]['date_count'] - 1) as idx}
            <div>
              {checks[level]['date_' + (idx + 1)].toLocaleDateString('en-GB', options)}
            </div>
          {/each}
          {#if checks[level]['date_count'] === 0}
            <div>No Date</div>
          {/if}
        </div>
      {/each}

      <div><b>{scoreHeaders.valid_on}</b></div>
      {#each admin_levels as _}<div />{/each}

      <div>{checkDescriptions['valid_on']}</div>
      {#each admin_levels as level}
        <div
          class:low={checks[level]['update_count'] !== 1 ||
            date - checks[level]['update_1'] > 1000 * 60 * 60 * 24 * 365}
        >
          {#each range(checks[level]['update_count'] - 1) as idx}
            <div>
              {checks[level]['update_' + (idx + 1)].toLocaleDateString('en-GB', options)}
            </div>
          {/each}
          {#if checks[level]['update_count'] === 0}
            <div>No Date</div>
          {/if}
        </div>
      {/each}
    </div>
  </section>
</main>

<style>
  @page {
    size: A4 landscape;
  }
  @media print {
    main {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .no-print {
      display: none;
    }
    .pagebreak {
      page-break-before: always;
    }
    img {
      height: auto;
      max-width: 75%;
    }
  }
  @media screen {
    img {
      height: auto;
      max-width: 100%;
    }
  }
  main {
    margin: 1rem auto;
    max-width: 1024px;
  }
  section {
    margin: 0 1rem;
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
  .img-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .metadata-grid {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: auto auto;
    justify-items: start;
  }
  .score-grid {
    align-items: center;
    display: grid;
    gap: 1rem;
    grid-template-columns: auto auto;
  }
  .check-grid {
    align-items: center;
    display: grid;
    gap: 1rem;
    grid-template-columns: auto repeat(var(--levels), auto);
  }
</style>
