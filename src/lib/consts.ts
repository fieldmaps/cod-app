export const baseURL = 'https://cod-data.fieldmaps.io';

export const scoreHeaders = {
  name: 'Name',
  iso3: 'Code',
  itos_service: 'Status',
  geometry_valid: 'Valid Geometry',
  geometry_hierarchy: 'Hierarchical Geometry',
  geometry_area: 'Same Area',
  geometry_bounds: 'Same Bounds',
  columns_required: 'Required Columns',
  columns_optional: 'Optional Columns',
  languages: 'Languages',
  dates: 'Valid On',
  score: 'Score',
};

export const scoreDescriptions = {
  geometry_valid:
    'Layers which have valid geometry. Valid geometry is defined by having no empty geometries, only containing polygons (no points or lines), not containing any self-intersecting rings, using WGS84 CRS (EPSG:4326), and containing no self-overlapping polygons.',
  geometry_hierarchy:
    'Layers which have perfect hierarchical nesting. Hierarchy is defined by each sub-national unit belonging to only a single parent (does not overlap between mutliple higher levels).',
  geometry_area:
    'Layers which all share the same area. Layers not sharing the same area may have empty areas representing water bodies whereas other layers have them filled out.',
  geometry_bounds:
    'Layers which all share the same geometric bounding box. Layers not sharing the same bounding box are partial layers which only cover a sub-section.',
  columns_required: 'Layers which have all required ADM columns. (ex. ADM2_EN, ADM2_PCODE, etc)',
  columns_optional: 'Layers which have all optional ADM columns. (ex. ADM2_REF, ADM2ALT1_EN, etc)',
  languages: 'Layers which have at least 1 language column detected.',
  dates: 'Layers which have been validated on within the last 12 months.',
};

export const checkDescriptions = {
  geom_not_empty: 'Are there any empty geometries contained within the layer?',
  geom_is_polygon: 'Are all geometries in the layer of type polygon?',
  geom_is_xy: 'Are all polygons 2 dimensional? Do they contain only XY coordinates and no Z?',
  geom_is_valid: 'Are all geometries valid?',
  geom_invalid_reason: 'If any geometries are invalid, how come?',
  geom_proj: 'What EPSG projection is used in the layer?',
  geom_bounds: 'Are all layer bounding boxes the same?',
  geom_area_km: 'How large is the layer rounded to square kilometers?',
  geom_overlaps_self: 'How many polygons overlap each other within the same layer?',
  geom_overlaps_parent:
    'How many polygons are not hierarchal, meaning they overlap with more than one parent polygon?',
};
