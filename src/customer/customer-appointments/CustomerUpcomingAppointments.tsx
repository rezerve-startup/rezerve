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
import image from '../../assets/avatar.jpg';
import { connect } from 'react-redux';
import { StoreState } from '../../shared/store/types';
import moment from 'moment';

import { updateCustomerAppointmentStatus, setUserCustomerAppointments } from '../../shared/store/actions';
import { firestore } from '../../config/FirebaseConfig';

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
    upcomingAppointmentsText: {
      fontSize: '1.5rem',
      marginTop: '1rem',
      marginBottom: '1rem'
    },
    accordionDetails: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    employeeAvatarContainer: {
      display: 'flex',
      marginBottom: '0.5rem'
    },
    cancelContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    upcomingApptContainer: {
      marginBottom: '1rem'
    },
    noUpcomingAppointmentsText: {
      fontStyle: 'italic'
    },
    appointmentServiceContainer: {
      display: 'flex',
      marginBottom: '0.5rem',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  });

function mapStateToProps(state: StoreState) {
  let upcomingAppointments: any[] = [];
  let appointments = state.system.user.customerInfo.appointments;
  let currentDate = Date.now();

  if (appointments) {
    for (let appointment of appointments) {
      let appointmentDate: Date = appointment.datetime.toDate();
  
      if (appointmentDate.valueOf() > currentDate && appointment.status === 'accepted') {
  
        appointment.formattedDate = moment(appointmentDate.toISOString()).format('YYYY-MM-DD');
        appointment.startTime = moment(appointmentDate.toISOString()).format('h:mm A');
        appointment.endTime = moment(appointmentDate.toISOString()).add(30 * appointment.service.length, 'minutes').format('h:mm A');
  
        upcomingAppointments.push(appointment);
      }
    }
  
    upcomingAppointments.sort((appt1, appt2) => appt1.datetime.toDate() - appt2.datetime.toDate());
  }

  return ({
    upcomingAppointments: upcomingAppointments,
    customerId: state.system.user.customerId
  });
}

type State = {
  incomingSchedule: IncomingSchedule[];
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
  updateCustomerAppointmentStatus?: any,
  setUserCustomerAppointments?: any,
  customerId?: string
}

class CustomerUpcomingAppointments extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      incomingSchedule: [],
      cancelAppointmentStatusDialogOpen: false,
      selectedAppointment: undefined,
      selectedAction: '',
    }
  }

  componentDidMount() {
    this.getCustomerAppointments();
  }

  dispatchSetUserCustomerAppointments(customerAppointments: any[]) {
    this.props.setUserCustomerAppointments(customerAppointments)
  }

  dispatchUpdateCustomerAppointmentStatus(appt: any) {
    this.props.updateCustomerAppointmentStatus(appt);
  }

  handleCloseCancelAppointmentDialog() {
    this.setState({
      cancelAppointmentStatusDialogOpen: false
    })
  }

  getCustomerAppointments() {
    firestore.collection('appointments').where('customerId', '==', `${this.props.customerId}`).get()
      .then((querySnapshot) => {
        let customerAppts: any[] = [];

        querySnapshot.forEach((apptDoc) => {
          const apptData = apptDoc.data();

          apptData.appointmentId = apptDoc.id;

          firestore.collection('users').where('employeeId', '==', `${apptData.employeeId}`).get()
            .then((querySnapshot) => {
              querySnapshot.forEach((userDoc) => {
                const userData = userDoc.data();

                apptData.employee = {
                  firstName: userData.firstName,
                  lastName: userData.lastName
                }

                customerAppts.push(apptData);

                this.dispatchSetUserCustomerAppointments(customerAppts);
              });
            })
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography className={classes.upcomingAppointmentsText}>Upcoming Appointments</Typography>
        {this.props.upcomingAppointments?.length === 0 ? (
          <Typography className={classes.noUpcomingAppointmentsText}>No Upcoming Appointments</Typography>
        ) : (
          this.props.upcomingAppointments?.map((appt, index) => (
          <Accordion key={index} className={classes.upcomingApptContainer}>
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
                <div className={classes.employeeAvatarContainer}>
                  <Avatar src={image} className={classes.small} />
                  <Typography>{appt.employee.firstName}</Typography>
                </div>
                <div className={classes.appointmentServiceContainer}>
                  <Typography>{appt.service.name}</Typography>
                  <Typography>${appt.service.price}</Typography>
                </div>
                <div className={classes.cancelContainer}>
                  <Button
                    size="small"
                    color="secondary"
                    variant="contained"
                    className={classes.button}
                    startIcon={<DeleteIcon />}
                    // tslint:disable-next-line: jsx-no-lambda
                    onClick={() => this.cancelAppointment(appt)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        )))}

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

  cancelAppointment(appt: any) {
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
      this.dispatchUpdateCustomerAppointmentStatus(appointmentToUpdate);

      this.setState({
        cancelAppointmentStatusDialogOpen: false,
      });
    });
  }
}

export default connect(mapStateToProps, { updateCustomerAppointmentStatus, setUserCustomerAppointments })(
  withStyles(styles, { withTheme: true })(CustomerUpcomingAppointments)
);
