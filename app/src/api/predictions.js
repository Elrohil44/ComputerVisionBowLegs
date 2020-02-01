import { fetchJson } from './abstract';

const fetchPredictions = async () => fetchJson('GET', 'predictions', 200);

export {
  fetchPredictions,
};

export default {
  fetchPredictions,
};
