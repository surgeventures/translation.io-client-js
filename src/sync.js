import po2json from 'po2json';

import request, { getSyncUri } from './request';
import info, { infoType } from './logger';

import {
  createForceDir,
  writeJSONFile,
  writeFile,
  readFile,
} from './file';

import {
  getWellFormattedPoText,
  writeTmpInfoFile,
  preparePayload,
  readTmpFile,
  getConfig,
  checkFor,
} from './helpers';

export default async (config = {}) => {
  try {
    const conf = await getConfig(config);
    checkFor(conf, 'apiKey');
    const syncUri = getSyncUri(conf.apiKey);

    info('Reading data from config file...');
    const configFile = await readTmpFile();

    info('Reading data from POT file...');
    checkFor(conf, 'potFile');
    const potData = await readFile(conf.potFile);

    checkFor(conf, 'targetLocales');
    checkFor(conf, 'sourceLocale');
    checkFor(conf, 'gemVersion');
    const payload = preparePayload({
      target_languages: conf.targetLocales,
      source_language: conf.sourceLocale,
      gem_version: conf.gemVersion,
      purge: conf.purge,
      pot_data: potData,
      ...configFile,
    });

    info('Requesting sync operation to server...');
    const response = await request(syncUri, payload);
    info('Saving new timestamp to temporary file...');
    await writeTmpInfoFile({ timestamp: +Date.now() });

    checkFor(conf, 'context');

    await createForceDir(`${conf.context}/messages`);
    await createForceDir(`${conf.context}/po`);
    conf.targetLocales.forEach(async (locale) => {
      const poData = response.data[`po_data_${locale}`];
      const jsonPo = po2json.parse(poData, { format: 'jed1.x' });

      await writeJSONFile(`${conf.context}/messages/${locale}.json`, jsonPo);
      await writeFile(`${conf.context}/po/${locale}.po`, getWellFormattedPoText(poData));
      info(`Saved new json and po files for ${locale} translation`, infoType.SUCCESS);
    });
  } catch (error) {
    info('Error occurred during sync operation', infoType.ERROR);
    info(error.message, infoType.ERROR);
  }
};
