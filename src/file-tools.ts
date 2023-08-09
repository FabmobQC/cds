import fs from 'fs';
import https from 'https';
import path from 'path';
import { ConfigFileToDownload } from './config';

export const loadJsonFile = (filePath: string) => {
  const buffer = fs.readFileSync(filePath);
  return JSON.parse(buffer.toString());
}

const checkInputFileExists = async (fullpath: string): Promise<boolean> => {
  return new Promise((resolve) => {
    fs.access(fullpath, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

const downloadFile = async (filesToDownload: ConfigFileToDownload): Promise<void> => {
  const fileExists = await checkInputFileExists(filesToDownload.destinationPath)
  const filename = path.basename(filesToDownload.destinationPath)
  return new Promise((resolve, reject) => {
    if (!fileExists) {
      console.log('Downloading file:', filename)
      https.get(filesToDownload.downloadUrl, (response: { pipe: (arg0: fs.WriteStream) => void; }) => {
        const writeStream = fs.createWriteStream(filesToDownload.destinationPath)
  
        response.pipe(writeStream);
  
        writeStream.on('finish', () => {
          resolve()
          console.log('File downloaded successfully:', filename);
        });
  
        writeStream.on('error', err => {
          console.error('Error saving file:', filename, '\n', err);
          reject()
        });
      })
    }
    else {
      console.log('File already exists:', filename)
      resolve()
    }
  })
}

export const downloadFiles = async (filesToDownload: ConfigFileToDownload[]): Promise<void[]> => {
  const promises = filesToDownload.map(downloadFile)
  return Promise.all(promises)
}
