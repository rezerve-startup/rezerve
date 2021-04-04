import React from 'react';
import { connect } from 'react-redux';
import { Container, createStyles, Theme, withStyles } from '@material-ui/core';

import AppointmentItem from './AppointmentItem';
import List from '@material-ui/core/List';
import { firestore } from '../../config/FirebaseConfig';
import { StoreState } from '../../shared/store/types';
import {
  updateCustomerPastAppointments,
  updateCustomerUpcomingAppointments,
} from '../../shared/store/actions';

function mapStateToProps(state: StoreState) {
  let currentAppointments = state.system.user.customerInfo.appointments;
  let appointmentsToAdd: any[] = [];

  if (currentAppointments) {
    for (const appointment of currentAppointments) {
      appointmentsToAdd.push(appointment);
    }
  }

  return {
    customer: state.customer,
    user: state.system.user,
    appointments: appointmentsToAdd
  };
}

class AppointmentsPage extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      upcomingAppointments: [],
      pastAppointments: [],
    };
  }

  componentDidMount() {
    this.getCustomerAppointments();
  }

  dispatchUpdateCustomerPastAppointment(pastAppointment: any) {
    this.props.updateCustomerPastAppointments(pastAppointment);
  }

  dispatchUpdateCustomerUpcomingAppointment(upcomingAppointment: any) {
    this.props.updateCustomerUpcomingAppointment(upcomingAppointment);
  }

  dispatchSetUserCustomerAppointments(customerAppointments: any[]) {
    this.props.setUserCustomerAppointments()
  }

  getCustomerAppointments() {
    firestore.collection('appointments').where('employeeId', '==', `${this.props.customerId}`).get()
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
    return (
      <Container>
        <div className="page-items">
          <div className="appointment-header">
            <h2>Appointments</h2>
          </div>
          <div className="upcoming-appointments">
            <h3>Upcoming</h3>
            <List>
              {this.state.upcomingAppointments.map((appointment) => (
                <AppointmentItem
                  businessName={appointment.businessName}
                  appointmentDate={appointment.appointmentDate}
                  appointmentPrice={appointment.appointmentPrice}
                />
              ))}
            </List>
          </div>
          <div className="past-appointments">
            <h3>Past</h3>
            <List>
              {this.state.pastAppointments.map((appointment) => (
                <AppointmentItem
                  businessName={appointment.businessName}
                  appointmentDate={appointment.appointmentDate}
                  appointmentPrice={appointment.appointmentPrice}
                />
              ))}
            </List>
          </div>
        </div>
      </Container>
    );
  }
}

const styles = (theme: Theme) => createStyles({});

export default connect(mapStateToProps, {
  updateCustomerPastAppointments,
  updateCustomerUpcomingAppointments,
})(withStyles(styles, { withTheme: true })(AppointmentsPage));
