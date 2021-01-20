import React from 'react';
import Carousel from 'react-material-ui-carousel';
import {
  Paper,
  Grid,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core';

import StylistCard from './StylistCard';
import AvailablityCard from './AvailabilityCard';
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
    const carouselComponents = [AvailablityCard, ContactCard];

    return (
      <div className={classes.root}>
        <Grid container={true} spacing={2}>
          <Grid item={true} xs={isMobile ? 12 : 6}>
            <Grid container={true} spacing={2} direction="column">
              <Grid item={true} xs={true}>
                <StylistCard isMobile={isMobile}/>
              </Grid>
              <Grid item={true} xs={true}>
                <Carousel>
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
                <Paper className={classes.paper}>Upcoming Appointments</Paper>
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
