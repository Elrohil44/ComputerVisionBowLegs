import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import ResultPanel from './ResultPanel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import {prediction, predictions} from "../api";


const FETCH_INTERVAL = 1000 * 10;

const images = [
  require('../images/default.png'),
  require('../images/upside_down.png'),
  require('../images/low_quality.png'),
];


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  image: {
    height: 'auto',
    width: 180,
  },
  control: {
    padding: theme.spacing(2),
  },
  title: {
    marginTop: 50,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'column',
    display: 'flex',
  },
  input: {
    display: 'none',
  },
  uploadButton: {
    width: 100,
  },
  uploadContainer: {
    height: 100,
  },
  uploadName: {
    marginTop: 10,
  },
  button: {
    margin: theme.spacing(1),
  },
}));


// Default images that user can upload
const DefaultOption = ({ isClicked, onClick, imgSource }) => {
  const classes = useStyles();

  return (
    <Grid item className={classes.option}>
      <img
        onClick={onClick}
        src={imgSource}
        className={classes.image}
      />
      <Checkbox
        checked={isClicked}
        onChange={onClick}
        value="primary"
        inputProps={{'aria-label': 'primary checkbox'}}
      />
    </Grid>
  );
};

const UploadButton = ({ onImagePick, pickedName }) => {
  const classes = useStyles();

  return (
    <div className={classes.uploadContainer}>
      <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        onChange={onImagePick}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          <AddIcon />
        </Button>
      </label>
      {pickedName ? (
        <Typography
          variant="subtitle2"
          className={classes.uploadName}
        >
          {pickedName}
        </Typography>
      ) : null}
    </div>
  );
};


// Main container
const BowLegAppContainer = () => {
  const classes = useStyles();

  const [lastFetched, setLastFetched] = useState(0);
  const [defaultImageIndex, setDefaultImageIndex] = useState(null);
  const [imageToUpload, setImageToUpload] = useState(null);
  const [uploadedTasks, setUploadedTasks] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => setLastFetched(0), FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, [lastFetched]);

  useEffect(() => {
    if (lastFetched + FETCH_INTERVAL < Date.now()) {
      predictions.fetchPredictions()
        .then((newPredictionsList) => {
          const ids = uploadedTasks.map(task => task._id);
          setUploadedTasks(newPredictionsList.filter(pred => ids.includes(pred._id)));
          setLastFetched(Date.now());
        })
        .catch((error) => console.error('Could not fetch predictions', error));
    }
  }, [lastFetched]);

  const uploadImage = (event) => {
    const file = event.target.files.item(0);
    if (/image\/.*/.test(file.type)) {
      setImageToUpload(file);
    } else {
      alert(`Invalid file type. Expected 'image/*' received '${file.type}'`);
    }
  };

  const submitTask = async () => {
    if (imageToUpload) {
      const createdPrediction = await prediction.createPrediction(imageToUpload);
      setUploadedTasks([...uploadedTasks, createdPrediction]);
      setImageToUpload(null);
    }
  };

  return (
    <Container maxWidth="md" className="App">
      <Typography
        variant="h2"
        className={classes.title}
      >
        Choose image
      </Typography>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={3}>
          {
            images.map((image, index) => (
              <DefaultOption
                isClicked={defaultImageIndex === index}
                onClick={() => setDefaultImageIndex(index)}
                imgSource={image}
              />
            ))
          }
        </Grid>
      </Grid>
      <Divider />
      <Typography
        variant="h4"
        className={classes.title}
      >
        or upload yours
      </Typography>
      <UploadButton
        onImagePick={uploadImage}
        pickedName={imageToUpload && imageToUpload.name}
      />
      <Divider />
      <Typography
        variant="h2"
        className={classes.title}
      >
        Submit task
      </Typography>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<CloudUploadIcon />}
        onClick={submitTask}
      >
        Submit
      </Button>
      <Typography
        variant="h4"
        className={classes.title}
      >
        and wait for results
      </Typography>
      <div>
        {uploadedTasks.map(task => <ResultPanel predictionTask={task} />)}
      </div>
    </Container>
  );
};

export default BowLegAppContainer;
