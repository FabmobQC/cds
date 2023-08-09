import { randomUUID } from 'crypto'
import lineOffset from "@turf/line-offset"
import { Feature, FeatureCollection, LineString, Units } from "@turf/helpers"
import { CdsArea, CdsZone } from "../types/cds";
import booleanWithin from "@turf/boolean-within";
import { ConfigCurb } from './config';

const buildZoneGeometry = (feature: Feature<LineString>, width: number, units: Units): CdsZone["geometry"] => {
  const offsetLine1 = lineOffset(feature, width/2, {units: units});
  const offsetLine2 = lineOffset(feature, -width/2, {units: units});
  const coords = [
    ...offsetLine1["geometry"]["coordinates"],
    ...offsetLine2["geometry"]["coordinates"].reverse(),
    offsetLine1["geometry"]["coordinates"][0],
  ]
  return {
    type: "Polygon",
    coordinates: [coords]
  }
}

const buildZone = (curbLine: Feature<LineString>, areas: CdsArea[], width: number, units: Units): CdsZone => {
  const geometry = buildZoneGeometry(curbLine, width, units)
  return {
    curb_zone_id: randomUUID(),
    geometry,
    curb_policy_ids: [],
    published_date: Date.now(),
    last_updated_date: Date.now(),
    start_date: Date.now(),
    street_name: curbLine.properties?.NOM_VOIE,
    street_side: curbLine.properties?.COTE,
    curb_area_ids: areas.map(area => area.curb_area_id),
  }
}

export const buildZonesForAreas = (curbLinesCollections: FeatureCollection[], areas: CdsArea[], configCurb: ConfigCurb): CdsZone[] => {

  const zones: CdsZone[] = []
  curbLinesCollections.forEach(curbLinesCollection => {
    curbLinesCollection.features.forEach(curbLine => {
      if (curbLine.geometry.type !== "LineString") { // Should handle also MultiLineString
        return;
      }
      const areasForLine = areas.filter(area => booleanWithin(curbLine, area.geometry))
      if (areasForLine.length !== 0) {
        zones.push(buildZone(curbLine as Feature<LineString>, areasForLine, configCurb.width, configCurb.units))
      }
    })
  })
  return zones;
}

export const extractGeometriesFromZones = (zones: CdsZone[]): FeatureCollection => {
  return {
    type: "FeatureCollection",
    features: zones.map(zone => {
      return {
        type: "Feature",
        geometry: zone.geometry,
        properties: {
          curb_zone_id: zone.curb_zone_id,
        }
      }
    })
  }
}