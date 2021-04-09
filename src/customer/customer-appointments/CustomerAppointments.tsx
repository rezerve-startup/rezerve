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
  TextField,
} from '@material-ui/core';
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
import { Message } from '@material-ui/icons';
import firebase from 'firebase';

function mapStateToProps(state: StoreState) {
  let allAppointments: any[] = [];
  let upcomingAppointments: any[] = [];
  let pastAppointments: any[] = [];
  let cancelledAppointments: any[] = [];
  let requestedAppointments: any[] = [];

  let appointments = state.system.user.customerInfo.appointments;
  let currentDate = Date.now();

  if (appointments) {
    for (let appointment of appointments) {
      let appointmentDate: Date = appointment.datetime.toDate();
  
      appointment.formattedDate = moment(appointmentDate.toISOString()).format('YYYY-MM-DD');
      appointment.startTime = moment(appointmentDate.toISOString()).format('h:mm A');
      appointment.endTime = moment(appointmentDate.toISOString()).add(30 * appointment.service.length, 'minutes').format('h:mm A');

      if (appointment.status === 'cancelled') {
        cancelledAppointments.push(appointment);
      } else if (appointment.status === 'requested') {
        requestedAppointments.push(appointment);
      } else if (appointmentDate.valueOf() > currentDate) {
        upcomingAppointments.push(appointment);
      } else {
        pastAppointments.push(appointment);
      }
    }

    requestedAppointments.sort((appt1, appt2) => appt1.datetime.toDate() - appt2.datetime.toDate());
    upcomingAppointments.sort((appt1, appt2) => appt1.datetime.toDate() - appt2.datetime.toDate());
    cancelledAppointments.sort((appt1, appt2) => appt1.datetime.toDate() - appt2.datetime.toDate());
    pastAppointments.sort((appt1, appt2) => appt1.datetime.toDate() - appt2.datetime.toDate());
  }

  return ({
    upcomingAppointments: upcomingAppointments,
    pastAppointments: pastAppointments,
    cancelledAppointments: cancelledAppointments,
    requestedAppointments: requestedAppointments,
    customerId: state.system.user.customerId
  });
}

type State = {
  cancelAppointmentStatusDialogOpen: boolean;
  selectedAppointment: any;
  selectedAction: string;
  messageToEmployee: string;
  messageDialogOpen: boolean;
  employeeId: string;
};

interface Props extends WithStyles<typeof styles> {
  upcomingAppointments?: any[],
  requestedAppointments?: any[],
  cancelledAppointments?: any[],
  pastAppointments?: any[],
  updateCustomerAppointmentStatus?: any,
  setUserCustomerAppointments?: any,
  customerId?: string
}

class CustomerUpcomingAppointments extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      cancelAppointmentStatusDialogOpen: false,
      selectedAppointment: undefined,
      selectedAction: '',
      messageToEmployee: '',
      messageDialogOpen: false,
      employeeId: ''
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

  handleOnChangeEmployeeMessage(e) {
    this.setState({
      messageToEmployee: e.target.value
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

  sendMessageToEmployee() {
    const employeeId = this.state.employeeId;

    firestore.collection('messages').where('customerId', '==', `${this.props.customerId}`).get()
      .then((querySnapshot) => {
          let employeeIdFound = false;

          querySnapshot.forEach((conversationDoc) => {
            const conversationData = conversationDoc.data();
            if (conversationData.employeeId === employeeId) {
              employeeIdFound = true;
              let messagesToUpdate = conversationData.messages;

              const messageToAdd = {
                senderId: this.props.customerId,
                datetime: firebase.firestore.Timestamp.fromDate(new Date(Date.now())),
                message: this.state.messageToEmployee
              }

              messagesToUpdate.push(messageToAdd);

              conversationDoc.ref.update({
                messages: messagesToUpdate
              });
            }
          });

          if (employeeIdFound === false) {
            const currentDatetime = firebase.firestore.Timestamp.fromDate(new Date(Date.now()));

            const messagesToAdd = [{
              senderId: this.props.customerId,
              datetime: currentDatetime,
              message: this.state.messageToEmployee
            }];

            const documentToAdd = {
              customerId: this.props.customerId,
              employeeId: employeeId,
              lastMessageDatetime: currentDatetime,
              messages: messagesToAdd
            }

            firestore.collection('messages').add(documentToAdd)
              .then((docRef) => {
                firestore.collection('employees').doc(`${employeeId}`).update({
                  messages: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                })
                .then(() => {
                  firestore.collection('customers').doc(`${this.props.customerId}`).update({
                    messages: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                  });
                })
              });
          }
      })
      .then(() => {
        this.setState({
          messageDialogOpen: false,
          messageToEmployee: '',
          employeeId: '',
        })
      });
  }

  openMessageDialog(employeeId) {
    this.setState({
      messageDialogOpen: true,
      employeeId: employeeId
    });
  }

  closeMessageDialog() {
    this.setState({
      messageDialogOpen: false,
      employeeId: ''
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.allUpcomingApptsContainer}>
          <Typography className={classes.appointmentsText}>Upcoming Appointments</Typography>
          {this.props.upcomingAppointments?.length === 0 ? (
            <Typography className={classes.noAppointmentsText}>No Upcoming Appointments</Typography>
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
                  <div className={classes.appointmentActionContainer}>
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
                    <Button
                      size="small"
                      color="secondary"
                      variant="contained"
                      className={classes.button}
                      startIcon={<Message />}
                      // tslint:disable-next-line: jsx-no-lambda
                      onClick={() => this.openMessageDialog(appt.employeeId)}
                    >
                      Message Employee
                    </Button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          )))}
        </div>

        <div className={classes.allRequestedApptsContainer}>
          <Typography className={classes.appointmentsText}>Requested Appointments</Typography>
          {this.props.requestedAppointments?.length === 0 ? (
            <Typography className={classes.noAppointmentsText}>No Requested Appointments</Typography>
          ) : (
            this.props.requestedAppointments?.map((appt, index) => (
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
                  <div className={classes.appointmentActionContainer}>
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
                    <Button
                      size="small"
                      color="secondary"
                      variant="contained"
                      className={classes.button}
                      startIcon={<Message />}
                      // tslint:disable-next-line: jsx-no-lambda
                      onClick={() => this.openMessageDialog(appt.employeeId)}
                    >
                      Message Employee
                    </Button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          )))}
        </div>

        <div className={classes.allPastApptsContainer}>
          <Typography className={classes.appointmentsText}>Past Appointments</Typography>
          {this.props.pastAppointments?.length === 0 ? (
            <Typography className={classes.noAppointmentsText}>No Past Appointments</Typography>
          ) : (
            this.props.pastAppointments?.map((appt, index) => (
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
                  <div className={classes.appointmentActionContainer}>
                    <Button
                      size="small"
                      color="secondary"
                      variant="contained"
                      className={classes.button}
                      startIcon={<Message />}
                      // tslint:disable-next-line: jsx-no-lambda
                      onClick={() => this.openMessageDialog(appt.employeeId)}
                    >
                      Message Employee
                    </Button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          )))}
        </div>

        <div>
          <Typography className={classes.appointmentsText}>Cancelled Appointments</Typography>
          {this.props.cancelledAppointments?.length === 0 ? (
            <Typography className={classes.noAppointmentsText}>No Cancelled Appointments</Typography>
          ) : (
            this.props.cancelledAppointments?.map((appt, index) => (
            <Accordion key={index} className={classes.cancelledApptContainer}>
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
                  <div className={classes.appointmentActionContainer}>
                    <Button
                      size="small"
                      color="secondary"
                      variant="contained"
                      className={classes.button}
                      startIcon={<Message />}
                      // tslint:disable-next-line: jsx-no-lambda
                      onClick={() => this.openMessageDialog(appt.employeeId)}
                    >
                      Message Employee
                    </Button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          )))}
        </div>

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

        <Dialog open={this.state.messageDialogOpen} onClose={() => this.closeMessageDialog()}>
          <DialogTitle>Message Employee</DialogTitle>
          <DialogContent>
          <DialogContentText>Please enter the message you would like to send these clients:</DialogContentText>
          <TextField value={this.state.messageToEmployee} onChange={(e) => this.handleOnChangeEmployeeMessage(e)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.sendMessageToEmployee()}>Send</Button>
          <Button onClick={() => this.closeMessageDialog()}>Cancel</Button>
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
    appointmentsText: {
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
    appointmentActionContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    upcomingApptContainer: {
      marginBottom: '1rem'
    },
    cancelledApptContainer: {
      marginBottom: '1rem',
      backgroundColor: 'lightgrey'
    },
    noAppointmentsText: {
      fontStyle: 'italic'
    },
    appointmentServiceContainer: {
      display: 'flex',
      marginBottom: '0.5rem',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    allUpcomingApptsContainer: {
      marginBottom: '1rem'
    },
    allRequestedApptsContainer: {
      marginBottom: '1rem'
    },
    allPastApptsContainer: {
      marginBottom: '1rem'
    }
  });

export default connect(mapStateToProps, { updateCustomerAppointmentStatus, setUserCustomerAppointments })(
  withStyles(styles, { withTheme: true })(CustomerUpcomingAppointments)
);
