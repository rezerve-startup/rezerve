import React from 'react';
import {
  Typography,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  Paper,
  Divider,
} from '@material-ui/core';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    button: {
      margin: theme.spacing(1),
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    column: {
      flexBasis: '33.33%',
    },
  });


type State = {
  incomingSchedule: IncomingSchedule[];
  currentDate: string; // YYYY-MM-DD
};

interface IncomingSchedule {
  startDate: string; // YYYY-MM-DDTHH:MM
  endDate: string; // YYYY-MM-DDTHH:MM
  title: string;
}

interface Props extends WithStyles<typeof styles> {}

class Upcoming extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      incomingSchedule: [
        {
          startDate: '2021-02-06T11:30',
          endDate: '2021-02-06T12:00',
          title: 'Haircut with customer',
        },
        {
          startDate: '2021-02-06T09:30',
          endDate: '2021-02-06T10:00',
          title: 'Haircut with Marcus',
        },
        {
          startDate: '2021-02-06T10:45',
          endDate: '2021-02-06T11:00',
          title: 'Haircut with customer',
        },
        {
          startDate: '2021-02-06T09:00',
          endDate: '2021-02-06T11:00',
          title: 'Haircut with customer',
        },
      ],
      currentDate: '2021-02-06',
    };

    // this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        
        <Divider/> 
        <Paper>
          <Scheduler data={this.state.incomingSchedule}>
            <ViewState currentDate={this.state.currentDate} />
            <DayView startDayHour={8} endDayHour={16} />
            <Appointments />
          </Scheduler>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Upcoming);
