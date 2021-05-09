import React from 'react';
import Carousel from 'react-material-ui-carousel';
import {
  Paper,
  Grid,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import BusinessCard from  './business-card'
import AvailabilityCard from './AvailabilityCard'
import PreferencesCard from './PreferencesCard';
import ContactCard from '../employee-home/home-tab/ContactCard';
import TodoList from '../employee-home/home-tab/TodoList';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
    card: {
      padding: theme.spacing(2),
    },
  });

interface Props extends WithStyles<typeof styles> {
  theme: Theme;
  isMobile: boolean;
}
type State = {};

class HomePanel extends React.Component<Props, State> {
  render() {
    const { classes, isMobile } = this.props;
    const carouselComponents = [AvailabilityCard];

    return (
      <div className={classes.root}>
        <Grid container={true} spacing={2}>
          <Grid item={true} xs={isMobile ? 12 : 6}>
            <Grid container={true} spacing={2} direction="column">
              <Grid item={true} xs={true}>
                <BusinessCard/>
              </Grid>
              <Grid item={true} xs={true}>
                <AvailabilityCard />
                {/* <Carousel
                  autoPlay={false}
                  animation="slide"
                  navButtonsAlwaysInvisible={isMobile ? true : false}
                >
                  {carouselComponents.map((Component, i) => (
                    <Component key={i} />
                  ))}
                </Carousel> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true, isMobile: false })(
  HomePanel,
);
