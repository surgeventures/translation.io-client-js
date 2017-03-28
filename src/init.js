import info, { infoType } from './logger';
import request, { getInitUri } from './request';

import { readFile } from './file';

import {
  generateDictFromPoFiles,
  writeTmpInfoFile,
  getConfig,
  checkFor,
} from './helpers';

export default async (config = {}) => {
  try {
    const conf = await getConfig(config);
    checkFor(conf, 'apiKey');
    const targetUri = getInitUri(conf.apiKey);

    info('Reading data from POT file...');
    const potData = await readFile(conf.potFile);

    info('Reading data from PO translation files...');
    checkFor(conf, 'targetLocales');
    const poData = await generateDictFromPoFiles(conf);

    checkFor(conf, 'sourceLocale');
    checkFor(conf, 'gemVersion');
    const payload = {
      target_languages: conf.targetLocales,
      source_language: conf.sourceLocale,
      gem_version: conf.gemVersion,
      pot_data: potData,
      ...poData,
    };

    info('Requesting init operation to server...');
    await request(targetUri, payload);
    info('Saving new timestamp to temporary file...');
    await writeTmpInfoFile({ timestamp: +Date.now() });
    info('Init completed', infoType.SUCCESS);
  } catch (error) {
    info('Error occurred during init operation', infoType.ERROR);
    info(error.message, infoType.ERROR);
  }
};
