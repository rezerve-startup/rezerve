import React from 'react';
import {
  Card,
  createStyles,
  FormControlLabel,
  Grid,
  Theme,
  withStyles,
  RadioGroup,
  Radio,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import cat1 from '../../../assets/business-pictures/cat1.jpg';
import { connect } from 'react-redux';
import { StoreState } from '../../../shared/store/types';
import { setSelectedEmployee, addSelectedEmployeeAppointment } from '../../../shared/store/actions';
import moment from 'moment';
import { firestore } from '../../../config/FirebaseConfig';
import firebase from 'firebase';

function mapStateToProps(state: StoreState) {
  return {
    user: state.system.user,
    businessEmployees: state.customer.employeesForBusiness,
    selectedEmployee: state.customer.selectedEmployee
  };
}

class BusinessInfoDetails extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      businessEmployees: this.props.businessEmployees,
      availableAppointmentTimes: [],
      selectedEmployee: null,
      selectedService: -1,
      selectedDate: '',
      selectedAppointmentSlot: -1,
      bookingMessageOpen: false,
      bookingMessage: ''
    };
  }
  
  componentDidMount() {
    this.dispatchSetSelectedEmployee(null);

    this.setState({
      selectedEmployee: null,
      selectedService: -1,
      selectedAppointmentSlot: -1,
      selectedDate: '',
    });
  }

  dispatchSetSelectedEmployee = (selectedEmployee) => {
    this.props.setSelectedEmployee(selectedEmployee);
  }

  dispatchAddAppointment = (appointmentToAdd) => {
    this.props.addSelectedEmployeeAppointment(appointmentToAdd);
  }

  handleSelectEmployee(e): void {
    this.setState({
      selectedService: -1,
      availableAppointmentTimes: [],
      selectedAppointmentSlot: -1
    })

    const selectedId = e.target.value;

    for (let employee of this.props.businessEmployees) {
      if (employee.id === selectedId) {
        this.dispatchSetSelectedEmployee(employee);
      }
    }
  }

  handleSelectedDateChange(e): void {
    this.setState({
      selectedDate: e.target.value
    });
  }

  selectService(index: number): void {
    this.setState({
      selectedService: index,
      selectedAppointmentSlot: -1,
      availableAppointmentTimes: [],
      bookDialogOpen: false
    });
  }

  selectAppointmentSlot(index: number): void {
    this.setState({
      selectedAppointmentSlot: index,
    });
  }

  getBusinessHoursDatetime(timeToConvert: string): Date {
    const timezoneOffset = (new Date()).getTimezoneOffset();

    // Parsing time from string solution adapted from https://stackoverflow.com/questions/141348/how-to-parse-a-time-into-a-date-object-from-user-input-in-javascript
    let datetime = new Date(Date.parse(this.state.selectedDate));
    datetime.setMinutes(datetime.getMinutes() + timezoneOffset);

    const timeToSet = timeToConvert.match(/(\d+)(:(\d\d))?\s*(p?)/i);

    if (timeToSet) {
      datetime.setHours( parseInt(timeToSet[1],10) + ( ( parseInt(timeToSet[1],10) < 12 && timeToSet[4] ) ? 12 : 0) );
      datetime.setMinutes( parseInt(timeToConvert[3],10) || 0 );
      datetime.setSeconds(0, 0);
    }

    return datetime;
  }

  findAvailableTimes() {
    this.setState({
      availableAppointmentTimes: []
    });

    const currentDate = new Date().toISOString().slice(0, 10);
    const parsedDate = Date.parse(this.state.selectedDate);

    if (this.props.selectedEmployee !== null && this.state.selectedService !== -1 && 
      this.state.selectedDate && parsedDate >= Date.parse(currentDate)) {
      
        const selectedDate = new Date(parsedDate);
        const timezoneOffset = (new Date()).getTimezoneOffset();
        selectedDate.setMinutes(selectedDate.getMinutes() + timezoneOffset);

        let businessOpen = false;

        for (const day of this.props.businessOpenDates) {
          if (moment().day(day).day() === moment(selectedDate.toISOString()).day()) {
            businessOpen = true;
            break;
          }
        }

        if (businessOpen) {
          let employeeWorking = false;
          let employeeAvailabilityOnDay;

          for (const employeeSchedule of this.props.selectedEmployee.availability) {
            if (moment().day(employeeSchedule.day).day() === moment(selectedDate.toISOString()).day()) {
              employeeWorking = true;
              employeeAvailabilityOnDay = employeeSchedule;
              break;
            }
          }

          if (employeeWorking) {
            
            let openingDateTime = this.getBusinessHoursDatetime(employeeAvailabilityOnDay?.start);
            let closingDateTime = this.getBusinessHoursDatetime(employeeAvailabilityOnDay?.end);
    
            let closingTimeMoment = moment(closingDateTime.toISOString()).local();
    
            let tempMoment = moment(openingDateTime.toISOString()).local();
    
            let serviceLength = this.props.selectedEmployee.services[this.state.selectedService].length;
    
            let availableTimeSlots: any[] = [];
    
            while (
              (tempMoment.valueOf() < closingDateTime.valueOf())
            ) {
              let startOfApptSlotMoment = tempMoment.clone();
              let endOfApptSlotMoment = tempMoment.clone().add(serviceLength * 30, 'minutes');
    
              let slotAvailable = true;
    
              for (const appt of this.props.selectedEmployee.appointments) {
                console.log(appt);
                if (appt.status !== 'cancelled') {
                  let existingApptMomentStart = moment(appt.datetime.toDate());
                  let existingApptMomentEnd = existingApptMomentStart.clone().add(appt.service.length * 30, 'minutes');
      
                  if (
                    // Two appointments start at same time
                    startOfApptSlotMoment.isSame(existingApptMomentStart) ||
                    // Two appointments end at the same time
                    endOfApptSlotMoment.isSame(existingApptMomentEnd) ||
                    // The existing appointment overlaps on the left
                    (startOfApptSlotMoment.isBefore(existingApptMomentStart) && endOfApptSlotMoment.isAfter(existingApptMomentStart)) ||
                    // The existing appointment overlaps on the right
                    (startOfApptSlotMoment.isBefore(existingApptMomentEnd) && endOfApptSlotMoment.isAfter(existingApptMomentEnd)) ||
                    // The existing appointment overlaps both sides
                    (existingApptMomentStart.isBefore(startOfApptSlotMoment) && existingApptMomentEnd.isAfter(endOfApptSlotMoment)) ||
                    //The existing appointment is contained within the time slot
                    (existingApptMomentStart.isAfter(startOfApptSlotMoment) && existingApptMomentEnd.isBefore(endOfApptSlotMoment))
                  ) {
                    slotAvailable = false;
                    break;
                  }
                }
              }
    
              // The appointment would end after business close
              if (endOfApptSlotMoment.isAfter(closingTimeMoment)) {
                slotAvailable = false;
              }
    
              if (slotAvailable) {
                const availableTime = tempMoment.clone();
                availableTimeSlots.push(availableTime); 
              }    
    
              tempMoment.add(30, 'minutes');
            }
    
            this.setState({
              availableAppointmentTimes: availableTimeSlots
            });
          }
        }
    }
  }

  bookAppointment() {
    firestore.collection('appointments').add({
      businessId: this.props.businessId,
      customerId: this.props.user.customerId,
      datetime: new Date(this.state.availableAppointmentTimes[this.state.selectedAppointmentSlot]),
      employeeId: this.props.selectedEmployee.id,
      service: this.props.selectedEmployee.services[this.state.selectedService],
      status: 'requested'
    }).then((docRef) => {
      firestore.collection('employees').doc(`${this.props.selectedEmployee.id}`).update({
        appointments: firebase.firestore.FieldValue.arrayUnion(docRef.id)
      }).then(() => {
        firestore.collection('customers').doc(`${this.props.user.customerId}`).update({
          appointments: firebase.firestore.FieldValue.arrayUnion(docRef.id)
        })
        .then(() => {
          let appointmentToAdd = {
            businessId: this.props.businessId,
            customerId: this.props.user.customerId,
            datetime: firebase.firestore.Timestamp.fromDate(new Date(this.state.availableAppointmentTimes[this.state.selectedAppointmentSlot])),
            employeeId: this.props.selectedEmployee.id,
            service: this.props.selectedEmployee.services[this.state.selectedService],
            status: 'requested'
          }
          this.dispatchAddAppointment(appointmentToAdd);

          this.resetBookings();
          this.handleCloseBookDialog();
          this.showSuccessfulBooking();
        })
      });
    }).catch((error) => {
      console.log(error);
      this.showFailedBooking();
    });
  }

  resetBookings() {
    this.setState({
      selectedEmployee: null,
      selectedService: -1,
      selectedAppointmentSlot: -1,
      selectedDate: '',
      availableAppointmentTimes: []
    });
  }

  handleOpenBookDialog() {
    this.setState({
      bookDialogOpen: true
    });
  }

  handleCloseBookDialog() {
    this.setState({
      bookDialogOpen: false
    });
  }

  handleCloseBookingMessage() {
    this.setState({
      bookingMessageOpen: false
    });
  }

  showSuccessfulBooking() {
    this.setState({
      bookingMessageOpen: true,
      bookingMessage: 'Booking Requested'
    });
  }

  showFailedBooking() {
    this.setState({
      bookingMessageOpen: true,
      bookingMessage: 'Failed Booking'
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.businessInfoDetails}>
          { this.props.businessEmployees.length > 0 &&
            <div>
              <RadioGroup aria-label="employee" name="employees" onChange={(e) => this.handleSelectEmployee(e)}>
                <Grid container={true} spacing={1}>
                  {this.props.businessEmployees.map((employee) => {
                    return (
                      <Grid container={true} item={true} xs={4} key={employee.id} className={classes.employeeSelection}>
                        <img
                          className={classes.businessPicture}
                          src={cat1}
                          alt=''
                        />
                        <FormControlLabel
                          value={employee.id}
                          control={
                            <Radio />
                          }
                          label={employee.firstName}
                        />
                        <div className={classes.employeePosition}><i>{employee.position}</i></div>
                      </Grid>
                    )})
                  }
                </Grid>

                <div className={classes.firstAvailableSelection}>
                  <FormControlLabel
                    value={'First-Available'}
                    control={<Radio />}
                    label={'FIRST AVAILABLE'}
                  />
                </div>
              </RadioGroup>

              {this.props.selectedEmployee && this.props.selectedEmployee.services.map((service, index) => {
                return (
                  <Card className={this.state.selectedService === index ? classes.selectedServiceCard : classes.serviceCard} 
                    variant="outlined" key={index} onClick={() => this.selectService(index)}>
                    <div className={classes.serviceHeader}>{service.name}</div>
                    <div className={classes.serviceLengthAndCost}>
                      <div className={this.state.selectedService === index ? classes.selectedServiceCardServiceLength : classes.serviceLength}>{service.length * 30} min</div>
                      <div>${service.price}</div>
                    </div>
                  </Card>
                )
              })}

              <div className={classes.appointmentSelection}>
                <div className={classes.setAppointmentDate}>
                  <TextField
                    id="date"
                    label="Select Date"
                    type="date"
                    value={this.state.selectedDate}
                    onChange={(e) => this.handleSelectedDateChange(e)}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <div className={classes.applyAppointmentDate}>
                  <Button variant="contained" onClick={() => this.findAvailableTimes()}>Apply</Button>
                </div>
              </div>

              <div className={classes.appointmentTimeSelection}>
                  {this.state.availableAppointmentTimes.map((apptTime, index) => {
                    return (
                      <div key={index} onClick={() => this.selectAppointmentSlot(index)} 
                        className={`${this.state.selectedAppointmentSlot === index ? classes.selectedAppointmentSlot : classes.appointmentSlot}`}
                      >{apptTime.format('h:mm A')}</div>
                    )
                  })}
              </div>

              <div className={classes.bookAppointment}>
                <Button variant="contained" 
                  color='primary'
                  className={classes.bookAppointmentButton}
                  onClick={() => this.handleOpenBookDialog()}>BOOK</Button>
              </div>
            </div>

          }
        </div>

        <Dialog open={this.state.bookDialogOpen} onClose={() => this.handleCloseBookDialog()}>
          <DialogTitle>Book Appointment?</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to book this appointment?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.bookAppointment()}>Yes</Button>
            <Button onClick={() => this.handleCloseBookDialog()}>No</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={this.state.bookingMessageOpen}
          autoHideDuration={6000}
          onClose={() => this.handleCloseBookingMessage()}
          message={this.state.bookingMessage}
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => this.handleCloseBookingMessage()}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    )
  }
}

const styles = (theme: Theme) =>
  createStyles({
    businessInfoDetails: {
      padding: '0 2rem 2rem 2rem',
      color: 'black'
    },
    firstAvailableSelection: {
      justifyContent: 'center'
    },
    employeeSelection: {
      justifyContent: 'center',
      marginBottom: '0.5rem'
    },
    businessPicture: {
      width: 'inherit',
    },
    serviceCard: {
      margin: '0.5rem',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 800
    },
    selectedServiceCard: {
      margin: '0.5rem',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 800,
      backgroundColor: theme.palette.primary.main,
      color: 'white'
    },
    serviceLengthAndCost: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    serviceLength: {
      marginRight: '1rem',
      fontSize: '0.75rem',
      color: theme.palette.primary.main
    },
    selectedServiceCardServiceLength: {
      marginRight: '1rem',
      fontSize: '0.75rem',
      color: 'white'
    },
    dateContainer: {
      display: 'inline-block',
      marginLeft: '0.5rem',
      marginRight: '0.5rem'
    },
    dateCircle: {
      color: 'red'
    },
    dateLabel: {
      color: 'red'
    },
    appointmentMonth: {
      marginTop: '1.5rem',
      fontSize: '1.5rem',
      fontWeight: 800
    },
    appointmentSelection: {
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    setAppointmentDate: {
      marginRight: '1rem'
    },
    applyAppointmentDate: {
      marginLeft: '1rem'
    },
    appointmentTimeSelection: {
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      flexWrap: 'wrap'
    },
    appointmentSlot: {
      border: `1px solid ${theme.palette.primary.main}`,
      fontWeight: 800,
      margin: '0.25rem',
      width: '5rem',
      color: theme.palette.primary.main
    },
    selectedAppointmentSlot: {
      border: `1px solid ${theme.palette.primary.main}`,
      fontWeight: 800,
      margin: '0.25rem',
      width: '5rem',
      backgroundColor: theme.palette.primary.main,
      color: 'white'
    },
    bookAppointment: {
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center'
    },
    bookAppointmentButton: {
      backgroundColor: `${theme.palette.primary.main}`,
      fontSize: '1.5rem',
      paddingLeft: '2rem',
      paddingRight: '2rem',
      color: 'white',
      width: 'auto'
    }
  }
);

export default connect(mapStateToProps, { setSelectedEmployee, addSelectedEmployeeAppointment })(
  withStyles(styles, { withTheme: true })(BusinessInfoDetails)
);
