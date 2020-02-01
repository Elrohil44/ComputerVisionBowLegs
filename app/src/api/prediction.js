import { fetchJson, fetchUploadJson } from './abstract';

const createPrediction = async (image) => fetchUploadJson('POST', 'prediction', 201, {}, { image });

const fetchPrediction = async (id) => fetchJson('GET', `prediction/${id}`, 200);

export {
  createPrediction,
  fetchPrediction,
};

export default {
  fetchPrediction,
  createPrediction,
};
