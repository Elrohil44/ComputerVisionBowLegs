import React from 'react';
import PropTypes from 'prop-types';

const STATIC_RESOURCES_ROOT_URL = 'http://10.1.1.44/static';

const Prediction = ({
  _id,
  status,
  sourcePath,
  maskPath,
  predictionPath,
  inProgressSince,
  id,
  onRefresh,
}) => (
  <tr>
    <td>{ _id }</td>
    <td>{ status }</td>
    <td><img
      alt="Source"
      src={`${STATIC_RESOURCES_ROOT_URL}/${sourcePath}`}
    />
    </td>
    <td>
      {
        status === 'COMPLETED'
          ? (
            <img
              alt="Mask"
              src={`${STATIC_RESOURCES_ROOT_URL}/${maskPath}`}
            />
          )

          : 'n/a'
      }
    </td>
    <td>
      { status === 'COMPLETED'
        ? (
          <img
            alt="Prediction"
            src={`${STATIC_RESOURCES_ROOT_URL}/${predictionPath}`}
          />
        )
        : 'n/a' }
    </td>
    <td>
      <button onClick={onRefresh}>{ 'Refresh' }</button>
    </td>
  </tr>
);

Prediction.propTypes = {
  _id: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  sourcePath: PropTypes.string.isRequired,
  maskPath: PropTypes.string,
  predictionPath: PropTypes.string,
  inProgressSince: PropTypes.string,
  id: PropTypes.string,
  onRefresh: PropTypes.func.isRequired,
};

export default Prediction;
