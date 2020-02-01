import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FadeLoader from 'react-spinners/FadeLoader';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';


const REACT_APP_STATIC_RESOURCES_ROOT_URL = process.env.REACT_APP_STATIC_RESOURCES_ROOT_URL
  || 'http://10.1.1.44/static';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    marginLeft: theme.typography.pxToRem(15),
    alignSelf: 'center',
  },
  option: {
    flexDirection: 'column',
    display: 'flex',
  },
  image: {
    height: 'auto',
    width: 180,
  },
  status: {
    width: 110,
    display: 'flex',
    justifyContent: 'center',
  },
}));

const ResultPanel = ({ predictionTask }) => {
  const classes = useStyles();

  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div className={classes.status}>
          { predictionTask.status !== 'QUEUED' && predictionTask.status !== 'IN_PROGRESS'
            ? (
              <Chip
                color="primary"
                size="medium"
                label={predictionTask.status}
              />
            ) : null }
          <FadeLoader
            size={10}
            color="#3f51b5"
            loading={predictionTask.status === 'QUEUED' || predictionTask.status === 'IN_PROGRESS'}
          />
        </div>
        <Typography
          className={classes.heading}
          variant="h6"
        >{ `ID: ${predictionTask._id}` }
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid
          container
          justify="center"
          spacing={3}
        >
          <Grid
            item
            className={classes.option}
          >
            <img
              alt="Source"
              src={`${REACT_APP_STATIC_RESOURCES_ROOT_URL}/${predictionTask.sourcePath}`}
              className={classes.image}
            />
            <Typography variant="h6">{ 'Source' }</Typography>
          </Grid>
          { predictionTask.maskPath && (
            <Grid
              item
              className={classes.option}
            >
              <img
                alt="Mask"
                src={`${REACT_APP_STATIC_RESOURCES_ROOT_URL}/${predictionTask.maskPath}`}
                className={classes.image}
              />
              <Typography variant="h6">{ 'Mask' }</Typography>
            </Grid>
          ) }
          { predictionTask.predictionPath && (
            <Grid
              item
              className={classes.option}
            >
              <img
                alt="Prediction"
                src={`${REACT_APP_STATIC_RESOURCES_ROOT_URL}/${predictionTask.predictionPath}`}
                className={classes.image}
              />
              <Typography variant="h6">{ 'Prediction' }</Typography>
            </Grid>
          ) }
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

ResultPanel.propTypes = {
  predictionTask: PropTypes.object.isRequired,
};

export default ResultPanel;
