import React, { useCallback, useEffect, useState } from 'react';
import { predictions, prediction } from '../api';
import Prediction from './Prediction';

const FETCH_INTERVAL = 1000 * 60;

const getUpdatedPredictionsList = (
  updatedPrediction,
  currentPredictionsList,
) => currentPredictionsList.map((predictionEntry) => {
  if (predictionEntry._id === updatedPrediction._id) {
    return updatedPrediction;
  }
  return predictionEntry;
});

const PredictionTable = () => {
  const [lastFetched, setLastFetched] = useState(0);
  const [predictionsList, setPredictionsList] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => setLastFetched(0), FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, [lastFetched]);
  useEffect(() => {
    if (lastFetched + FETCH_INTERVAL < Date.now()) {
      predictions.fetchPredictions()
        .then((newPredictionsList) => {
          setPredictionsList(newPredictionsList);
          setLastFetched(Date.now());
        })
        .catch((error) => console.error('Could not fetch predictions', error));
    }
  }, [lastFetched]);

  const onRefresh = useCallback((id) => {
    const updatePrediction = async () => {
      const updatedPrediction = await prediction.fetchPrediction(id);
      const updatedPredictions = getUpdatedPredictionsList(updatedPrediction, predictionsList);
      setPredictionsList(updatedPredictions);
    };

    updatePrediction()
      .catch((error) => console.error('Failed to update prediction', error));
  }, [setPredictionsList, predictionsList]);

  const fileInput = React.createRef();

  const schedulePrediction = () => {
    fileInput.current.click();
  };

  const uploadImage = async (event) => {
    const file = event.target.files.item(0);
    if (/image\/.*/.test(file.type)) {
      const createdPrediction = await prediction.createPrediction(file);
      setPredictionsList([...predictionsList, createdPrediction]);
      alert('Successfully scheduled prediction');
    } else {
      alert(`Invalid file type. Expected 'image/*' received '${file.type}'`);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th colSpan={5}>
            <button onClick={schedulePrediction}>{ 'Schedule prediction' }</button>
            <button onClick={() => setLastFetched(0)}>{ 'Refresh predictions' }</button>
            <input
              ref={fileInput}
              style={{ display: 'none' }}
              type="file"
              accept="image/*"
              onChange={uploadImage}
            />
          </th>
        </tr>
        <tr>
          <th>{ 'ID' }</th>
          <th>{ 'Status' }</th>
          <th>{ 'Source Image' }</th>
          <th>{ 'Mask Image' }</th>
          <th>{ 'Prediction Image' }</th>
          <th>{ 'Actions' }</th>
        </tr>
      </thead>
      <tbody>
        { predictionsList.map((item, ndx) => (
          <Prediction
            key={item._id || ndx}
            {...item}
            onRefresh={() => onRefresh(item._id)}
          />
        )) }
      </tbody>
    </table>
  );
};

export default PredictionTable;
