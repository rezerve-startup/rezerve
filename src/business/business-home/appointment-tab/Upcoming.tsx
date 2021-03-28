import React from 'react';
import {
  Typography,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Avatar,
} from '@material-ui/core';
// tslint:disable-next-line: no-submodule-imports
import { Description } from '@material-ui/icons/';
// tslint:disable-next-line: no-submodule-imports
import DeleteIcon from '@material-ui/icons/Delete';
// tslint:disable-next-line: no-submodule-imports
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import image from '../../../assets/avatar.jpg';
import { connect } from 'react-redux';
import { StoreState } from '../../../shared/store/types';
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
  let upcomingAppointments: any[] = [];
  let appointments = state.system.user.employeeInfo.appointments;
  let currentDate = Date.now();

  for (let appointment of appointments) {
    let appointmentDate: Date = appointment.datetime.toDate();

    if (appointmentDate.valueOf() > currentDate) {

      appointment.startTime = moment(appointmentDate.toISOString()).format('h:mm A');

      upcomingAppointments.push(appointment);
    }
  }

  upcomingAppointments.sort((appt1, appt2) => appt1.datetime.toDate() - appt2.datetime.toDate());

  return ({
    upcomingAppointments: upcomingAppointments
  });
}

type State = {
  incomingSchedule: IncomingSchedule[];
};

interface IncomingSchedule {
  id: number;
  name: string;
  apptType: string;
  start: string;
  duration: string;
}

interface Props extends WithStyles<typeof styles> {
  upcomingAppointments?: any[]
}

class Upcoming extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.props.upcomingAppointments?.map((appt, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className={classes.column}>
                <Avatar src={image} className={classes.small} />
                <Typography>{appt.client.firstName}</Typography>
              </div>
              <div className={classes.column}>
                <Typography className={classes.heading}>
                  {appt.startTime}
                </Typography>
              </div>
              <div className={classes.column}>
                <Typography
                  className={classes.heading}
                  style={{ margin: 'auto' }}
                >
                  {appt.service.length * 15} min
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <Button
                size="small"
                color="primary"
                variant="contained"
                className={classes.button}
                startIcon={<Description />}
                // tslint:disable-next-line: jsx-no-lambda
                onClick={() => this.handleClick(appt)}
              >
                Send Message
              </Button>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                className={classes.button}
                startIcon={<DeleteIcon />}
                // tslint:disable-next-line: jsx-no-lambda
                onClick={() => this.handleClick(appt)}
              >
                Cancel Appt.
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
  }

  handleClick(item: IncomingSchedule) {
    // tslint:disable-next-line: no-console
    console.log(item);
    this.updateItem(item.id);
  }

  updateItem(id: number) {
    const idx = this.state.incomingSchedule.findIndex((x) => x.id === id);
    if (idx === -1) {
      // tslint:disable-next-line: no-console
      console.log('N/A');
    } else {
      // tslint:disable-next-line: no-console
      console.log('Button pressed');
    }
  }
}

export default connect(mapStateToProps, null)(
  withStyles(styles, { withTheme: true })(Upcoming)
);
