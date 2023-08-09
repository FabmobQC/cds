import { buildAreas } from "./areas-builder.js";
import { readConfig } from "./config.js";
import { downloadFiles, loadJsonFile } from "./file-tools.js";
import { buildPoliciesForZones } from "./policies-builder.js";
import { buildZonesForAreas } from "./zones-builder.js";
import { FeatureCollection } from "@turf/helpers";

const main = async () => {
  const config = readConfig();
  await downloadFiles(config.filesToDownload);
  const areas = await buildAreas(config["areas"])
  const curbLinesFiles = config["curbLinesPaths"].map(loadJsonFile);
  const zones = buildZonesForAreas(curbLinesFiles as FeatureCollection[], areas, config["curb"]);
  buildPoliciesForZones(config["policies"], zones);
  console.log(JSON.stringify(zones));
}

main();