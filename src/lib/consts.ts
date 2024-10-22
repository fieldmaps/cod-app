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
  area_sqkm: 'Sq. km',
  other: 'Other',
};

export const scoreDescriptions = {
  geometry_valid:
    'Layers which have valid geometry. Valid geometry is defined by having no empty geometries, only containing polygons (no points or lines), not containing any self-intersecting rings, using WGS84 CRS (EPSG:4326), and has a valid bounding box.',
  geometry_topology:
    'Layers which have valid topology. Valid topology is defined as having no sliver gaps or overlaps within a layer, with each polygon being fully contained within their parent.',
  geometry_area:
    'Layers which all share the same area. Layers not sharing the same area may have empty areas representing water bodies whereas other layers have them filled out.',
  area_sqkm:
    'Layers which have an area attribute in square kilometers and value matches area calculated above using NASA EASE-Grid 2.0.',
  table_pcodes:
    'Layers which have all required P-Code columns (ADM2_PCODE), with no empty cells, only alphanumeric characters, starting with a valid ISO-2 code, no duplicate codes, all codes within a column having the same length, and hierarchical nesting codes.',
  table_names:
    'Layers which have all required name columns (ADM2_EN), with no empty cells, no duplicate rows, no double / leading / trailing spaces, no columns all uppercase / lowercase, no cells lacking alphabetic characters, and all characters matching the language code.',
  languages:
    "Layers which have at least 1 language column detected, all language codes used are valid, a romanized language is featured first, and layers don't have more languages than their parents.",
  date: 'Layers which have a valid date value for their source.',
  valid_on: 'Layers which have been validated on within the last 12 months.',
  other: 'Layers which have no fields other than expected values.',
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
  pcode_not_iso2: "How many P-Codes don't start with a valid ISO-2 code?",
  pcode_not_alnum: "How many P-Codes aren't alphanumeric?",
  pcode_lengths: 'How many different P-Code lengths are there?',
  pcode_duplicated: 'How many P-Codes are duplicated?',
  pcode_not_nested: "How many P-Codes can't nest with their parent value?",
  name_column_levels:
    'How many admin levels (eg. ADM2) are represented with name columns? (eg. ADM2_EN)',
  name_column_count:
    'How many name columns are present? (should be number of languages multiplied by number of admin levels)',
  name_empty: 'How many names are empty?',
  name_duplicated: 'How many rows have duplicated names? (considers all admin levels)',
  name_spaces_double: 'How many names have double spaces?',
  name_spaces_strip: 'How many names have leading or trailing spaces?',
  name_upper: 'How many names are all uppercase?',
  name_lower: 'How many names are all lowercase?',
  name_no_valid:
    "How many names don't contain any alphabetic characters? (eg. all numbers or punctuation)",
  name_invalid_adm0: "How many Admin 0 names don't match the official UNTERM short name?",
  name_invalid: 'How many names use characters outside of their defined language?',
  name_invalid_char_count: 'How many invalid characters are detected?',
  name_invalid_chars: 'What invalid characters are detected?',
  languages: 'What languages are used in the dataset, are they all valid codes?',
  language_parent: "Does the parent contain all the current layer's languages?",
  language_romanized: 'Does the first listed language use a Roman (Latin) script?',
  date: "What is the date of the dataset's source?",
  valid_on: 'When was the dataset last validated on?',
  valid_to_exists: 'Does the layer have a validTo field?',
  valid_to_empty: "Is the layer's validTo field empty?",
  area_sqkm: "What is the total area according to the layer's attribute value?",
  ref_name_columns: 'How many reference name fields are present?',
  alt_name_columns: 'How many alternative name fields are present?',
  other_columns: 'How many other fields are present?',
};
