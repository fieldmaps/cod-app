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

      <div>{checkDescriptions['geom_not_empty']}</div>
      {#each admin_levels as level}
        <div class:low={!checks[level]['geom_not_empty']}>
          {checks[level]['geom_not_empty'] ? 'No' : 'Yes'}
        </div>
      {/each}

      <div>{checkDescriptions['geom_is_polygon']}</div>
      {#each admin_levels as level}
        <div class:low={!checks[level]['geom_is_polygon']}>
          {checks[level]['geom_is_polygon'] ? 'Yes' : 'No'}
        </div>
      {/each}

      <div>{checkDescriptions['geom_is_xy']}</div>
      {#each admin_levels as level}
        <div class:low={!checks[level]['geom_is_xy']}>
          {checks[level]['geom_is_xy'] ? 'Yes' : 'No'}
        </div>
      {/each}

      <div>{checkDescriptions['geom_is_valid']}</div>
      {#each admin_levels as level}
        <div class:low={!checks[level]['geom_is_valid']}>
          {checks[level]['geom_is_valid'] ? 'Yes' : 'No'}
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

      <div>{checkDescriptions['geom_overlaps_self']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['geom_overlaps_self']}>
          {checks[level]['geom_overlaps_self'] || 0}
        </div>
      {/each}

      <div>{checkDescriptions['geom_overlaps_parent']}</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['geom_overlaps_parent']}>
          {checks[level]['geom_overlaps_parent'] || 0}
        </div>
      {/each}

      <div>
        How many admin levels (eg. ADM2) are represented with any columns starting with ADM?
      </div>
      {#each admin_levels as level}
        <div class:low={checks[level]['levels_with_data'] !== level + 1}>
          {checks[level]['levels_with_data']}
        </div>
      {/each}

      <div>How many admin levels (eg. ADM2) are represented with name columns? (eg. ADM2_EN)</div>
      {#each admin_levels as level}
        <div class:low={checks[level]['levels_with_name'] !== level + 1}>
          {checks[level]['levels_with_name']}
        </div>
      {/each}

      <div>How many name columns are present? (eg. ADM2_EN)</div>
      {#each admin_levels as level}
        <div
          class:low={checks[level]['name_count'] !== checks[level]['language_count'] * (level + 1)}
        >
          {checks[level]['name_count']}
        </div>
      {/each}

      <div>
        How many admin levels (eg. ADM2) are represented with P-Code columns? (eg. ADM2_PCODE)
      </div>
      {#each admin_levels as level}
        <div class:low={checks[level]['levels_with_pcode'] !== level + 1}>
          {checks[level]['levels_with_pcode']}
        </div>
      {/each}

      <div>
        How many admin levels (eg. ADM2) are represented with reference name columns? (eg. ADM2_REF)
      </div>
      {#each admin_levels as level}
        <div class:low={checks[level]['levels_with_reference_name'] !== 1}>
          {checks[level]['levels_with_reference_name']}
        </div>
      {/each}

      <div>
        How many admin levels (eg. ADM2) are represented with alternative name columns? (eg.
        ADM2ALT1_EN)
      </div>
      {#each admin_levels as level}
        <div class:low={checks[level]['levels_with_alternative_name'] !== 1}>
          {checks[level]['levels_with_alternative_name']}
        </div>
      {/each}

      <div>How many alternative name columns are present? (eg. ADM2ALT1_EN)</div>
      {#each admin_levels as level}
        <div
          class:low={checks[level]['alternative_name_count'] !==
            checks[level]['language_count'] * 2}
        >
          {checks[level]['alternative_name_count']}
        </div>
      {/each}

      <div>What percentage of cells are empty?</div>
      {#each admin_levels as level}
        <div>
          {format('.0%')(
            checks[level]['number_of_missing_records'] /
              (checks[level]['total_number_of_records'] || 1),
          )}
        </div>
      {/each}

      <div>What is the date of the dataset's source?</div>
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

      <div>When was the dataset last updated?</div>
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

      <div>What languages are used in the dataset?</div>
      {#each admin_levels as level}
        <div class:low={!checks[level]['language_count']}>
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
