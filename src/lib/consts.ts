export const baseURL = 'https://cod-data.fieldmaps.io';

export const scoreHeaders = {
  geometry_valid: 'Valid Geometry',
  geometry_topology: 'Valid Topology',
  geometry_area: 'Equal Area',
  columns_required: 'Required Columns',
  languages: 'Languages',
  date: 'Date',
  valid_on: 'Valid On',
};

export const scoreDescriptions = {
  geometry_valid:
    'Layers which have valid geometry. Valid geometry is defined by having no empty geometries, only containing polygons (no points or lines), not containing any self-intersecting rings, using WGS84 CRS (EPSG:4326), and has a valid bounding box.',
  geometry_topology:
    'Layers which have valid topology. Valid topology is defined as having no sliver gaps or overlaps within a layer, and having perfect hierarchical nesting (each feature only belongs to one parent feature).',
  geometry_area:
    'Layers which all share the same area. Layers not sharing the same area may have empty areas representing water bodies whereas other layers have them filled out.',
  columns_required: 'Layers which have all required ADM columns. (ex. ADM2_EN, ADM2_PCODE, etc)',
  languages:
    'Layers which have at least 1 language column detected and all language codes used are valid.',
  date: 'Layers which have a valid date value for their source.',
  valid_on: 'Layers which have been validated on within the last 12 months.',
};

export const checkDescriptions = {
  geom_not_empty: 'Are there any empty geometries contained within the layer?',
  geom_is_polygon: 'Are all geometries in the layer of type polygon?',
  geom_is_xy: 'Are all polygons 2 dimensional? Do they contain only XY coordinates and no Z?',
  geom_is_valid: 'Are all geometries valid?',
  geom_invalid_reason: 'If any geometries are invalid, how come?',
  geom_proj: 'What EPSG projection is used in the layer?',
  geom_min_max_x_y: 'Does the layer have an invalid bounding box?',
  geom_bounds: 'Are all layer bounding boxes the same?',
  geom_area_km: 'How large is the layer rounded to square kilometers?',
  geom_gaps: 'Are there any sliver gaps within the layer?',
  geom_overlaps_self: 'How many polygons overlap each other within the same layer?',
  geom_overlaps_parent:
    'How many polygons are not hierarchal, meaning they overlap with more than one parent polygon?',
};
