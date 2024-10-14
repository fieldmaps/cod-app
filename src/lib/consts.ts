export const baseURL = 'https://cod-data.fieldmaps.io';

export const scoreHeaders = {
  geometry_valid: 'Valid Geometry',
  geometry_topology: 'Valid Topology',
  geometry_area: 'Equal Area',
  table_pcodes: 'P-Codes',
  table_names: 'Names',
  languages: 'Languages',
  date: 'Date',
  valid_on: 'Valid On',
};

export const scoreDescriptions = {
  geometry_valid:
    'Layers which have valid geometry. Valid geometry is defined by having no empty geometries, only containing polygons (no points or lines), not containing any self-intersecting rings, using WGS84 CRS (EPSG:4326), and has a valid bounding box.',
  geometry_topology:
    'Layers which have valid topology. Valid topology is defined as having no sliver gaps or overlaps within a layer, with each polygon being fully contained within their parent.',
  geometry_area:
    'Layers which all share the same area. Layers not sharing the same area may have empty areas representing water bodies whereas other layers have them filled out.',
  table_pcodes: 'Layers which have all required P-Code columns (ADM2_PCODE), with no empty cells.',
  table_names:
    'Layers which have all required Name columns (ADM2_EN), with no empty cells, no columns all uppercase, ',
  languages:
    'Layers which have at least 1 language column detected, contain no additional languages not found in other layers, and all language codes used are valid.',
  date: 'Layers which have a valid date value for their source.',
  valid_on: 'Layers which have been validated on within the last 12 months.',
};

export const checkDescriptions = {
  geom_count: 'How many geometries are in the layer?',
  geom_empty: 'How many geometries are empty?',
  geom_not_polygon: 'How many geometries are not polygons?',
  geom_has_z: 'How many geometries have 3D coordinates?',
  geom_invalid: 'How many geometries are invalid?',
  geom_invalid_reason: 'If any geometries are invalid, how come?',
  geom_proj: 'What EPSG projection is used in the layer?',
  geom_min_max_x_y: 'Does the layer have an invalid bounding box?',
  geom_bounds: 'Are all layer bounding boxes the same?',
  geom_area_km: 'How large is the layer rounded to square kilometers?',
  geom_gaps: 'Are there any sliver gaps within the layer?',
  geom_overlaps_self: 'How many polygons overlap each other within the same layer?',
  geom_not_within_parent: "How many polygons aren't fully contained within their parent?",
  geom_not_within_pcode: 'How many polygons list a P-Code different than the one their parent has?',
  pcode_column_levels:
    'How many admin levels (eg. ADM2) are represented with P-Code columns? (eg. ADM2_PCODE)',
  pcode_empty: 'How many P-Codes are empty?',
  pcode_not_iso2: "How many P-Codes don't start with a valid ISO-2?",
  pcode_not_alnum: "How many P-Codes aren't alphanumeric?",
  pcode_not_nested: "How many P-Codes can't nest with their parent value?",
  name_column_levels:
    'How many admin levels (eg. ADM2) are represented with name columns? (eg. ADM2_EN)',
  name_column_count:
    'How many name columns are present? (should be number of languages multiplied by number of admin levels)',
  name_empty: 'How many names are empty?',
  name_upper: 'How many names are all uppercase?',
  name_no_valid:
    "How many names don't contain any alphabetic characters? (eg. all numbers or punctuation)",
  name_invalid: 'How many names use characters outside of their defined language?',
  name_illegal_char_count: 'How many illegal characters are detected?',
  name_illegal_chars: 'What illegal characters are detected?',
  languages: 'What languages are used in the dataset?',
  date: "What is the date of the dataset's source?",
  valid_on: 'When was the dataset last validated on?',
};
