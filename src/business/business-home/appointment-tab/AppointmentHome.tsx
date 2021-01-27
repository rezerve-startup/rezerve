import React from 'react';
import Carousel from 'react-material-ui-carousel';
import {
  Paper,
  Grid,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  Card,
  Typography,
} from '@material-ui/core';

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

class AppointmentPanel extends React.Component<Props, State> {
  render() {
    const { classes, isMobile } = this.props;

    return (
      <Card className={classes.root}>
        <Typography>Appointments Page </Typography>
      </Card>
    
    
      );
  }
}

export default withStyles(styles, { withTheme: true, isMobile: false })(
  AppointmentPanel,
);
