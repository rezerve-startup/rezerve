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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
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

import { updateAppointmentStatus } from '../../../shared/store/actions';
import { firestore } from '../../../config/FirebaseConfig';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    heading: {
      fontSize: '0.9rem',
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
      fontSize: '0.75rem',
      flexBasis: '50%'
    },
    apptTimeColumn: {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
    },
    apptDateColumn: {
      height: '100%',
      alignItems: 'center',
      display: 'flex'
    },
    requestedAppointmentsText: {
      fontSize: '1.5rem',
      marginTop: '1rem',
      marginBottom: '1rem'
    },
    accordionDetails: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    customerAvatarContainer: {
      display: 'flex',
      marginBottom: '0.5rem'
    },
    acceptOrDenyContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    requestedApptContainer: {
      marginBottom: '1rem'
    }
  });

function mapStateToProps(state: StoreState) {
  let upcomingAppointments: any[] = [];
  let appointments = state.system.user.employeeInfo.appointments;
  let currentDate = Date.now();

  for (let appointment of appointments) {
    let appointmentDate: Date = appointment.datetime.toDate();

    if (appointmentDate.valueOf() > currentDate && appointment.status === 'requested') {

      appointment.formattedDate = moment(appointmentDate.toISOString()).format('YYYY-MM-DD');
      appointment.startTime = moment(appointmentDate.toISOString()).format('h:mm A');
      appointment.endTime = moment(appointmentDate.toISOString()).add(30 * appointment.service.length, 'minutes').format('h:mm A');

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
  acceptAppointmentStatusDialogOpen: boolean;
  cancelAppointmentStatusDialogOpen: boolean;
  selectedAppointment: any;
  selectedAction: string;
};

interface IncomingSchedule {
  id: number;
  name: string;
  apptType: string;
  start: string;
  duration: string;
}

interface Props extends WithStyles<typeof styles> {
  upcomingAppointments?: any[],
  updateAppointmentStatus?: any
}

class EmployeeRequestedAppointments extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      incomingSchedule: [],
      acceptAppointmentStatusDialogOpen: false,
      cancelAppointmentStatusDialogOpen: false,
      selectedAppointment: undefined,
      selectedAction: '',
    }
  }

  dispatchUpdateAppointmentStatus(appt: any) {
    this.props.updateAppointmentStatus(appt);
  }

  handleCloseAcceptAppointmentDialog() {
    this.setState({
      acceptAppointmentStatusDialogOpen: false
    })
  }

  handleCloseCancelAppointmentDialog() {
    this.setState({
      cancelAppointmentStatusDialogOpen: false
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography className={classes.requestedAppointmentsText}>Requested Appointments</Typography>
        {this.props.upcomingAppointments?.map((appt, index) => (
          <Accordion key={index} className={classes.requestedApptContainer}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className={classes.column}>
                <div className={classes.apptDateColumn}>
                  <Typography className={classes.heading}>{appt.formattedDate}</Typography>
                </div>
              </div>
              <div className={classes.column}>
                <div className={classes.apptTimeColumn}>
                  <Typography className={classes.heading}>
                    {appt.startTime} - {appt.endTime}
                  </Typography>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.accordionDetails}>
                <div className={classes.customerAvatarContainer}>
                  <Avatar src={image} className={classes.small} />
                  <Typography>{appt.client.firstName}</Typography>
                </div>
                <div className={classes.acceptOrDenyContainer}>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    startIcon={<Description />}
                    // tslint:disable-next-line: jsx-no-lambda
                    onClick={() => this.acceptAppointment(appt)}
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    variant="contained"
                    className={classes.button}
                    startIcon={<DeleteIcon />}
                    // tslint:disable-next-line: jsx-no-lambda
                    onClick={() => this.declineAppointment(appt)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}

        <Dialog open={this.state.acceptAppointmentStatusDialogOpen} onClose={() => this.handleCloseAcceptAppointmentDialog()}>
          <DialogTitle>Accept Appointment</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you would like to accept this appointment?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.updateAppointmentStatus()}>Yes</Button>
            <Button onClick={() => this.handleCloseAcceptAppointmentDialog()}>No</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.cancelAppointmentStatusDialogOpen} onClose={() => this.handleCloseCancelAppointmentDialog()}>
          <DialogTitle>Cancel Appointment</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you would like to cancel this appointment?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.updateAppointmentStatus()}>Yes</Button>
            <Button onClick={() => this.handleCloseCancelAppointmentDialog()}>No</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  acceptAppointment(appt: any) {
    this.setState({
      acceptAppointmentStatusDialogOpen: true,
      selectedAppointment: appt,
      selectedAction: 'accepted'
    });
  }

  declineAppointment(appt: any) {
    this.setState({
      cancelAppointmentStatusDialogOpen: true,
      selectedAppointment: appt,
      selectedAction: 'cancelled'
    });
  }

  updateAppointmentStatus() {
    let appointmentToUpdate = this.state.selectedAppointment;
    appointmentToUpdate.status = this.state.selectedAction;

    firestore.collection('appointments').doc(`${appointmentToUpdate.appointmentId}`).update({
      status: appointmentToUpdate.status
    }).then(() => {
      this.dispatchUpdateAppointmentStatus(appointmentToUpdate);

      this.setState({
        acceptAppointmentStatusDialogOpen: false,
        cancelAppointmentStatusDialogOpen: false,
      })
    });
  }
}

export default connect(mapStateToProps, { updateAppointmentStatus })(
  withStyles(styles, { withTheme: true })(EmployeeRequestedAppointments)
);
