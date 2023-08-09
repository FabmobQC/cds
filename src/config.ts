import { Units } from '@turf/helpers';
import { loadJsonFile } from './file-tools.js';

const configPath = 'config.json'

export interface ConfigCurb {
  width: number
  units: Units
}

export interface ConfigFileToDownload {
  downloadUrl: string // URL to download the file
  infosUrl: string // URL to find the informations about the file, such as the download url if it gets updated
  destinationPath: string
}

export interface ConfigArea {
  name: string
  geometryFilePath: string
}

export interface ConfigFile {
  name: string
  path: string
}

export interface ConfigPolicy {
  type: string
  files: ConfigFile[]
}

export interface Config {
  curb: ConfigCurb
  inputDir: string
  filesToDownload: ConfigFileToDownload[]
  areas: ConfigArea[]
  curbLinesPaths: string[]
  policies: ConfigPolicy[]
}

export const readConfig = (): Config => {
  return loadJsonFile(configPath);
}