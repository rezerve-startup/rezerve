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

import StylistCard from './StylistCard';
import AvailabilityCard from './AvailabilityCard';
import ContactCard from './ContactCard';
import TodoList from './TodoList';

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
    const carouselComponents = [AvailabilityCard, ContactCard];

    return (
      <div className={classes.root}>
        <Grid container={true} spacing={2}>
          <Grid item={true} xs={isMobile ? 12 : 6}>
            <Grid container={true} spacing={2} direction="column">
              <Grid item={true} xs={true}>
                <StylistCard isMobile={isMobile} />
              </Grid>
              <Grid item={true} xs={true}>
                <Carousel
                  stopAutoPlayOnHover={true}
                  animation="slide"
                  navButtonsAlwaysInvisible={isMobile ? true : false}
                >
                  {carouselComponents.map((Component, i) => (
                    <Component key={i} />
                  ))}
                </Carousel>
              </Grid>
            </Grid>
          </Grid>
          <Grid item={true} xs={isMobile ? 12 : 6}>
            <Grid container={true} spacing={2} direction="column">
              <Grid item={true} xs={true}>
                <Paper className={classes.paper}>
                  <Typography
                    component="h1"
                    variant="h1"
                    color="primary"
                    align="left"
                  >
                    20
                  </Typography>
                  <Typography
                    component="h5"
                    variant="h5"
                    align="left"
                    style={{ fontWeight: 600 }}
                  >
                    Upcoming Appointments
                  </Typography>
                </Paper>
              </Grid>
              <Grid item={true} xs={true}>
                <TodoList />
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
