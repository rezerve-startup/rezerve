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
  return {
    customer: state.customer,
    user: state.system.user,
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

  getCustomerAppointments() {
    // Get appointment ids for customer
    firestore
      .collection('customers')
      .doc(`${this.props.user.customerId}`)
      .get()
      .then((customerObj) => {
        const appointmentDoc = customerObj.data();

        if (appointmentDoc) {
          const appointmentIds = appointmentDoc.appointments;

          appointmentIds.forEach((appointmentId: string) => {
            // Get appointment objects for customer
            firestore
              .collection('appointments')
              .doc(`${appointmentId}`)
              .get()
              .then((appointmentObj) => {
                const appointmentDoc = appointmentObj.data();

                if (appointmentDoc) {
                  // Get business name of the appointment
                  firestore
                    .collection('businesses')
                    .doc(`${appointmentDoc.businessId}`)
                    .get()
                    .then((businessObj) => {
                      const businessDoc = businessObj.data();

                      if (businessDoc) {
                        const appointmentDatetime = appointmentDoc.datetime.toDate();

                        const appointmentDateString = appointmentDatetime.toLocaleString(
                          [],
                          {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          },
                        );

                        const appointmentObject = {
                          appointmentId: `${appointmentObj.id}`,
                          businessName: `${businessDoc.name}`,
                          appointmentDate: `${appointmentDateString}`,
                          appointmentPrice: `$${appointmentDoc.cost}`,
                        };
                        if (
                          appointmentDatetime >
                          new Date(new Date().toDateString())
                        ) {
                          this.setState({
                            upcomingAppointments: [
                              ...this.state.upcomingAppointments,
                              appointmentObject,
                            ],
                          });
                          // this.dispatchUpdateCustomerUpcomingAppointment(appointmentObject);
                        } else {
                          this.setState({
                            pastAppointments: [
                              ...this.state.pastAppointments,
                              appointmentObject,
                            ],
                          });
                          // this.dispatchUpdateCustomerPastAppointment(appointmentObject);
                        }
                      }
                    });
                }
              });
          });
        }
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
