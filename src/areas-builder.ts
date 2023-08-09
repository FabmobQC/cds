import { randomUUID } from 'crypto'
import fs from 'fs';
import { Polygon } from "@turf/helpers";
import { ConfigArea } from "./config";
import { CdsArea } from '../types/cds';

const loadGeometries = (configAreas: ConfigArea[]): Record<string, Polygon> => {
  return configAreas.reduce((acc, configArea) => {
    const buffer = fs.readFileSync(configArea.geometryFilePath);
    acc[configArea.name] = JSON.parse(buffer.toString()).features[0].geometry; // For now we assume there is only one feature
    return acc
  }, {} as Record<string, Polygon>)
}

const buildArea = (configArea: ConfigArea, geometry: Polygon): CdsArea => {
  return {
    curb_area_id: randomUUID(),
    geometry,
    name: configArea.name,
    published_date: Date.now(),
    last_updated_date: Date.now(),
    curb_zone_ids: [],
  }
}

export const buildAreas = async (configAreas: ConfigArea[]): Promise<CdsArea[]> => {
  const geometries = loadGeometries(configAreas)
  return configAreas.map(configArea => buildArea(configArea, geometries[configArea.name]));
}