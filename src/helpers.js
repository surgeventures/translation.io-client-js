/* eslint-disable no-empty, consistent-return */

import gettextParser from 'gettext-parser';
import invariant from 'invariant';
import Promise from 'bluebird';
import omit from 'lodash.omit';
import omitBy from 'lodash.omitby';
import { resolve } from 'path';

import { TEMP_INFO_PATH } from './config';
import info, { infoType } from './logger';
import {
  writeJSONFile,
  readJSONFile,
  readFile,
  createDir,
} from './file';

const isUndefined = val => typeof val === 'undefined';

export const getWellFormattedPoText = (poText) => {
  const parsedPoText = gettextParser.po.compile(gettextParser.po.parse(poText));
  return parsedPoText.toString('utf8').replace(/\\n/, '');
};

export const getConfig = async (configFromCli) => {
  if (configFromCli.config) {
    const config = await readJSONFile(configFromCli.config);
    const clearConfigFromCli = omitBy(omit(configFromCli, 'config'), isUndefined);
    return {
      ...config,
      apiKey: config.apiKey || process.env['TRANSLATIONIO_API_KEY'], // eslint-disable-line dot-notation
      ...clearConfigFromCli,
    };
  }

  return configFromCli;
};

export const generateDictFromPoFiles = async (config) => {
  const {
    targetLocales,
    context,
  } = config;

  try {
    return await Promise.reduce(targetLocales, async (prev, next) => {
      const poPath = resolve(process.cwd(), context, `po/${next}.po`);
      const contents = await readFile(poPath);
      return {
        ...prev,
        [`po_data_${next}`]: contents,
      };
    }, {});
  } catch (e) {
    info(e, infoType.ERROR);
  }
};

export const writeTmpInfoFile = async (data) => {
  try {
    await createDir('.tmp');
  } catch (e) {}
  try {
    await writeJSONFile(TEMP_INFO_PATH, data);
  } catch (e) {
    info(e, infoType.ERROR);
  }
};

export const preparePayload = base =>
  Object.keys(base).reduce((prev, next) => {
    const nextObj = base[next] ? { [next]: base[next] } : {};
    return {
      ...prev,
      ...nextObj,
    };
  }, {});

export const checkFor = (value, name, message) =>
  invariant(typeof value[name] !== 'undefined', message || `You need to provide: ${name}`);

export const readTmpFile = () => readJSONFile(TEMP_INFO_PATH);
