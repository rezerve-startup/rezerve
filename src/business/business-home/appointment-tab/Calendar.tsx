import React from 'react';
import {
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
import { StoreState } from '../../../shared/store/types';
import { connect } from 'react-redux';
import moment from 'moment';

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

function mapStateToProps(state: StoreState) {
  console.log(state.system.user.employeeInfo);

  let scheduleItems: any[] = [];

  for (let appt of state.system.user.employeeInfo.appointments) {
    let startDateMoment = moment(appt.datetime.toDate());
    let endDateMoment = startDateMoment.add(30 * appt.service.length, 'minutes');

    let apptToAdd = {
      title: `${appt.service.name} with ${appt.client.firstName}`,
      startDate: appt.datetime.toDate(),
      endDate: endDateMoment.toDate()
    };

    scheduleItems.push(apptToAdd);
  }

  console.log(scheduleItems);

  return({
    scheduleItems: scheduleItems
  });
}

type State = {
  currentDate: string; // YYYY-MM-DD
};

interface IncomingSchedule {
  startDate: string; // YYYY-MM-DDTHH:MM
  endDate: string; // YYYY-MM-DDTHH:MM
  title: string;
}

interface Props extends WithStyles<typeof styles> {
  scheduleItems?: any[]
}

class Calendar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let currentDate: Date = new Date(Date.now());

    this.state = {
      currentDate: '2021-03-31',
    };

    // this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Divider />
        <Paper>
          <Scheduler data={this.props.scheduleItems}>
            <ViewState currentDate={this.state.currentDate} />
            <DayView startDayHour={8} endDayHour={17} />
            <Appointments />
          </Scheduler>
        </Paper>
      </div>
    );
  }
}

export default connect(mapStateToProps, null) (
  withStyles(styles, { withTheme: true })(Calendar)
);
