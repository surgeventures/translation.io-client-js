import axios from 'axios';

import { TARGET_URI } from './config';

export default async function request(uri, payload) {
  try {
    return await axios.post(uri, payload);
  } catch ({ response: { data: { error } } }) {
    throw new Error(error);
  }
}

const getUri = (apiKey, action) => `${TARGET_URI}/${apiKey}/${action}`;
export const getInitUri = apiKey => getUri(apiKey, 'init');
export const getSyncUri = apiKey => getUri(apiKey, 'sync');
