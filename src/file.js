/* eslint-disable no-empty, consistent-return */

import Bluebird from 'bluebird';
import mkdirp from 'mkdirp';
import {
  readFile as fsReadFile,
  writeFile as fsWriteFile,
} from 'fs';
import { resolve } from 'path';

import info, { infoType } from './logger';

const writeFilePromisified = Bluebird.promisify(fsWriteFile);
const readFilePromisified = Bluebird.promisify(fsReadFile);
const mkDirPromisified = Bluebird.promisify(mkdirp);

export const readFile = (fileLocation, encoding = 'utf-8') =>
  readFilePromisified(fileLocation, encoding);

export const createDir = (dirName) => {
  mkDirPromisified(resolve(dirName));
};

export const createForceDir = async (dirName) => {
  try {
    await createDir(dirName);
  } catch (e) {}
};

export const readJSONFile = async (path) => {
  try {
    const fileContent = await readFilePromisified(resolve(path), 'utf-8');
    return JSON.parse(fileContent);
  } catch (e) {
    info(e, infoType.ERROR);
  }
};

export const writeFile = (path, data) =>
  writeFilePromisified(resolve(path), data, 'utf-8');

export const writeJSONFile = (path, data) =>
  writeFile(path, JSON.stringify(data, undefined, 2));
