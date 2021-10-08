import {
  Accordion,
  AccordionDetails,
  AccordionSummary, Avatar, Button, createStyles, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, Theme, Typography,
  withStyles, WithStyles
} from '@material-ui/core';
// tslint:disable-next-line: no-submodule-imports
import { Description, Message } from '@material-ui/icons/';
// tslint:disable-next-line: no-submodule-imports
import DeleteIcon from '@material-ui/icons/Delete';
// tslint:disable-next-line: no-submodule-imports
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import firebase from 'firebase';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import image from '../../../assets/avatar.jpg';
import { firestore } from '../../../config/FirebaseConfig';
import { setUserEmployeeAppointments, updateEmployeeAppointmentStatus } from '../../../shared/store/actions';
import { StoreState } from '../../../shared/store/types';
import AcceptAppointment from './AcceptAppointment';

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
      marginRight: '0.5rem'
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
    },
    noRequestedAppointments: {
      fontStyle: 'italic'
    },
    appointmentServiceContainer: {
      display: 'flex',
      marginBottom: '0.5rem',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    appointmentsText: {
      fontSize: '1.5rem',
      marginTop: '1rem',
      marginBottom: '1rem'
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

function mapStateToProps(state: StoreState) {
  let upcomingAppointments: any[] = [];
  let pastAppointments: any[] = [];
  let cancelledAppointments: any[] = [];
  let requestedAppointments: any[] = [];

  let appointments = state.system.user.employeeInfo.appointments;
  let currentDate = Date.now();

  if (appointments) {
    for (let appointment of appointments) {
      let appointmentDate: Date = appointment.datetime.toDate();
  
      appointment.formattedDate = moment(appointmentDate.toISOString()).format('YYYY-MM-DD');
      appointment.startTime = moment(appointmentDate.toISOString()).format('h:mm A');
      appointment.endTime = moment(appointmentDate.toISOString()).add(30 * appointment.service.length, 'minutes').format('h:mm A');

      if (appointment.status === 'cancelled' || (appointment.status === 'requested' && appointmentDate.valueOf() < currentDate)) {
        //cancelledAppointments.push(appointment);
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
    employeeId: state.system.user.employeeId
  });
}


type State = {
  incomingSchedule: IncomingSchedule[];
  acceptAppointmentStatusDialogOpen: boolean;
  cancelAppointmentStatusDialogOpen: boolean;
  declinedDialogOpen: boolean;
  selectedAppointment: any;
  selectedAction: string;
  messageDialogOpen: boolean;
  customerId: string;
  messageToCustomer: string;
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
  requestedAppointments?: any[],
  cancelledAppointments?: any[],
  pastAppointments?: any[],
  updateEmployeeAppointmentStatus?: any,
  setUserEmployeeAppointments?: any,
  employeeId?: string
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
      messageDialogOpen: false,
      customerId: '',
      messageToCustomer: '',
      declinedDialogOpen: false
    }
  }

  componentDidMount() {
    this.getEmployeeAppointments();
  }

  dispatchSetUserEmployeeAppointments(employeeAppts) {
    this.props.setUserEmployeeAppointments(employeeAppts);
  }

  dispatchUpdateEmployeeAppointmentStatus(appt: any) {
    this.props.updateEmployeeAppointmentStatus(appt);
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

  getEmployeeAppointments() {
    firestore.collection('appointments').where('employeeId', '==', `${this.props.employeeId}`).get()
      .then((querySnapshot) => {
        let employeeAppts: any[] = [];

        querySnapshot.forEach((apptDoc) => {
          const apptData = apptDoc.data();

          apptData.appointmentId = apptDoc.id;

          if (apptData.customerId === 'Guest') {  
            apptData.client = {
              firstName: apptData.guestName,
              lastName: ''
            };

            employeeAppts.push(apptData);

            this.dispatchSetUserEmployeeAppointments(employeeAppts);
          } else {
            firestore.collection('users').where('customerId', '==', `${apptData.customerId}`).get()
              .then((querySnapshot) => {
                querySnapshot.forEach((userDoc) => {
                  const userData = userDoc.data();
  
                  apptData.client = {
                    firstName: userData.firstName,
                    lastName: userData.lastName
                  }
  
                  employeeAppts.push(apptData);
  
                  this.dispatchSetUserEmployeeAppointments(employeeAppts);
                });
              })
          }

        });
      })
  }

  cancelAppointment(appt: any) {
    this.setState({
      cancelAppointmentStatusDialogOpen: true,
      selectedAppointment: appt,
      selectedAction: 'cancelled'
    });
  }

  openMessageDialog(customerId) {
    this.setState({
      messageDialogOpen: true,
      customerId: customerId
    });
  }

  closeMessageDialog() {
    this.setState({
      messageDialogOpen: false,
      customerId: ''
    });
  }

  handleCloseDeclinedDialog(){
    this.setState({
      declinedDialogOpen: false
    })
  }

  forceCancelAppointment(){
    this.setState({
      selectedAction: 'cancelled',
    })
    this.updateAppointmentStatus();
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
                    <Typography>{appt.client.firstName}</Typography>
                  </div>
                  <div className={classes.appointmentServiceContainer}>
                    <Typography>{appt.service.name}</Typography>
                    <Typography>${appt.service.price}</Typography>
                  </div>
                  <div className={classes.appointmentActionContainer}>
                    {appt.customerId !== 'Guest' &&
                      <Button
                        size="small"
                        color="secondary"
                        variant="contained"
                        className={classes.button}
                        startIcon={<Message />}
                        // tslint:disable-next-line: jsx-no-lambda
                        onClick={() => this.openMessageDialog(appt.customerId)}
                      >
                        Message
                      </Button>
                    }
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
                    <Typography>{appt.client.firstName}</Typography>
                  </div>
                  <div className={classes.appointmentServiceContainer}>
                    <Typography>{appt.service.name}</Typography>
                    <Typography>${appt.service.price}</Typography>
                  </div>
                  <div className={classes.appointmentActionContainer}>
                  
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
                      onClick={() => this.cancelAppointment(appt)}
                    >
                      Cancel
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
                    <Typography>{appt.client.firstName}</Typography>
                  </div>
                  <div className={classes.appointmentServiceContainer}>
                    <Typography>{appt.service.name}</Typography>
                    <Typography>${appt.service.price}</Typography>
                  </div>
                  <div className={classes.appointmentActionContainer}>
                    {appt.customerId !== 'Guest' &&
                      <Button
                        size="small"
                        color="secondary"
                        variant="contained"
                        className={classes.button}
                        startIcon={<Message />}
                        // tslint:disable-next-line: jsx-no-lambda
                        onClick={() => this.openMessageDialog(appt.customerId)}
                      >
                        Message
                      </Button>
                    }
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          )))}
        </div>

        {/* <div>
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
                    <Typography>{appt.client.firstName}</Typography>
                  </div>
                  <div className={classes.appointmentServiceContainer}>
                    <Typography>{appt.service.name}</Typography>
                    <Typography>${appt.service.price}</Typography>
                  </div>
                  <div className={classes.appointmentActionContainer}>
                    {appt.customerId !== 'Guest' &&
                      <Button
                        size="small"
                        color="secondary"
                        variant="contained"
                        className={classes.button}
                        startIcon={<Message />}
                        // tslint:disable-next-line: jsx-no-lambda
                        onClick={() => this.openMessageDialog(appt.customerId)}
                      >
                        Message
                      </Button>
                    }
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          )))}
        </div> */}

        <Dialog open={this.state.acceptAppointmentStatusDialogOpen} onClose={(reason: 'backdropClick') => {}}> 
          <AcceptAppointment appt={this.state.selectedAppointment} this={this}/>
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

        <Dialog open={this.state.declinedDialogOpen} onClose={() => this.handleCloseDeclinedDialog()}>
          <DialogTitle>Unable to Book Appointment</DialogTitle>
          <DialogContent>
            <DialogContentText>There has been an error with the booking process on the client's end.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Typography align="center"><Button onClick={() => this.handleCloseDeclinedDialog()}>Ok</Button></Typography>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.messageDialogOpen} onClose={() => this.closeMessageDialog()}>
          <DialogTitle>Message Customer</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter the message you would like to send these clients:</DialogContentText>
            <TextField value={this.state.messageToCustomer} onChange={(e) => this.handleOnChangeCustomerMessage(e)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.sendMessageToCustomer(this.state.messageToCustomer, this.state.customerId)}>Send</Button>
            <Button onClick={() => this.closeMessageDialog()}>Cancel</Button>
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
      status: appointmentToUpdate.status,
      cID: firebase.firestore.FieldValue.delete()
    }).then(() => {
      this.dispatchUpdateEmployeeAppointmentStatus(appointmentToUpdate);
      if (appointmentToUpdate.customerId !== 'Guest') {
        if (appointmentToUpdate.status === 'cancelled') {
          this.sendMessageToCustomer(`We're sorry, but your appointment on ${appointmentToUpdate.formattedDate} from ${appointmentToUpdate.startTime} - ${appointmentToUpdate.endTime} has been cancelled.`, appointmentToUpdate.customerId);
        } else if (appointmentToUpdate.status === 'accepted') {
          this.sendMessageToCustomer(`Your appointment on ${appointmentToUpdate.formattedDate} from ${appointmentToUpdate.startTime} - ${appointmentToUpdate.endTime} has been accepted.`, appointmentToUpdate.customerId);

        }
        
      }
      this.setState({
        acceptAppointmentStatusDialogOpen: false,
        cancelAppointmentStatusDialogOpen: false,
      })
    });
  }

  handleOnChangeCustomerMessage(e) {
    this.setState({
      messageToCustomer: e.target.value
    })
  }

  sendMessageToCustomer(messageToSend: string, customerId: string) {
    firestore.collection('messages').where('employeeId', '==', `${this.props.employeeId}`).get()
      .then((querySnapshot) => {
          let customerIdFound = false;

          querySnapshot.forEach((conversationDoc) => {
            const conversationData = conversationDoc.data();
            if (conversationData.customerId === customerId) {
              customerIdFound = true;
              let messagesToUpdate = conversationData.messages;

              const messageToAdd = {
                senderId: this.props.employeeId,
                datetime: firebase.firestore.Timestamp.fromDate(new Date(Date.now())),
                message: messageToSend
              }

              messagesToUpdate.push(messageToAdd);

              conversationDoc.ref.update({
                messages: messagesToUpdate
              });
            }
          });

          if (customerIdFound === false) {
            const currentDatetime = firebase.firestore.Timestamp.fromDate(new Date(Date.now()));

            const messagesToAdd = [{
              senderId: this.props.employeeId,
              datetime: currentDatetime,
              message: messageToSend
            }];

            const documentToAdd = {
              customerId: customerId,
              employeeId: this.props.employeeId,
              lastMessageDatetime: currentDatetime,
              messages: messagesToAdd
            }

            firestore.collection('messages').add(documentToAdd)
              .then((docRef) => {
                firestore.collection('customers').doc(`${customerId}`).update({
                  messages: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                })
                .then(() => {
                  firestore.collection('employees').doc(`${this.props.employeeId}`).update({
                    messages: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                  });
                })
              });
          }
      })
      .then(() => {
        this.setState({
          messageDialogOpen: false,
          messageToCustomer: '',
          customerId: '',
        })
      });
  }
}

export default connect(mapStateToProps, { updateEmployeeAppointmentStatus, setUserEmployeeAppointments })(
  withStyles(styles, { withTheme: true })(EmployeeRequestedAppointments)
);
