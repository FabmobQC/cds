import { randomUUID } from "crypto"
import { FeatureCollection } from "@turf/helpers"
import booleanWithin from "@turf/boolean-within"

import { CdsPolicy, CdsZone } from "../types/cds"
import { ConfigPolicy } from "./config"
import { loadJsonFile } from "./file-tools.js"

const buildPolicy = (): CdsPolicy => {
  return {
    curb_policy_id: randomUUID(),
    published_date: Date.now(),
    priority: 1,
    rules: []
  }
}

const buildMontrealPolicies = (files: Record<string, object>, zones: CdsZone[]): CdsPolicy[] => {
  const policies: CdsPolicy[] = [];
  const stationnement = files["stationnement"] as FeatureCollection
  stationnement.features.forEach(feature => {
    const zonesForPolicy = zones.filter(zone => booleanWithin(feature, zone.geometry))
    if (zonesForPolicy.length > 1) {
      console.warn("Warning: more than one zone for policy")
    }
    if (zonesForPolicy.length === 1) {
      const policy = buildPolicy(); // Temporary dummy policy
      const zone = zonesForPolicy[0];
      zone.curb_policy_ids.push(policy.curb_policy_id);
      // policies.push(policy); // keep empty for now
    }
  })
  return policies;
}

export const buildPoliciesForZones = (configPolicies: ConfigPolicy[], zones: CdsZone[]): CdsPolicy[] => {
  const policies: CdsPolicy[] = [];
  configPolicies.forEach(configPolicy => {
    const files = configPolicy.files.reduce((acc, file) => {
      acc[file.name] = loadJsonFile(file.path);
      return acc;
    }, {} as Record<string, object>);
    if (configPolicy.type === "montreal") {
      const montrealPolicies = buildMontrealPolicies(files, zones);
      policies.push(...montrealPolicies);
    }
  });
  return policies;
}