import React from 'react';
import { Container } from '@material-ui/core';
// import AppointmentItem from './AppointmentItem';

import List from '@material-ui/core/List';
import { firestore } from '../../config/FirebaseConfig';

let DATA = [
  {
    appointmentId: 0,
    businessName: '2cut Barbershop',
    appointmentDate: '11/21/21',
    appointmentPrice: '$26.94',
  },
  {
    appointmentId: 1,
    businessName: '2cut Barbershop',
    appointmentDate: '11/21/21',
    appointmentPrice: '$26.94',
  },
  {
    appointmentId: 2,
    businessName: '2cut Barbershop',
    appointmentDate: '11/21/21',
    appointmentPrice: '$26.94',
  },
  {
    appointmentId: 3,
    businessName: '2cut Barbershop',
    appointmentDate: '11/21/21',
    appointmentPrice: '$26.94',
  },
  {
    appointmentId: 4,
    businessName: '2cut Barbershop',
    appointmentDate: '11/21/21',
    appointmentPrice: '$26.94',
  },
  {
    appointmentId: 5,
    businessName: '2cut Barbershop',
    appointmentDate: '11/21/21',
    appointmentPrice: '$26.94',
  },
];

class AppointmentsPage extends React.Component {
  state = {
    upcomingAppointments: [],
    pastAppointments: DATA,
  };

  componentDidMount() {
    firestore.collection('users').onSnapshot((snapshot) => {
      const appointments = snapshot.docs[0].data().appointments;
      console.log(appointments);

      let upcomingAppointments: any = [];
      let pastAppointments: any = [];
      for (let i = 0; i < appointments.length; i++) {
        let appointment = appointments[i];
        let appointmentDate = appointment.dateTime.toDate();

        let appointmentDateString = appointmentDate.toLocaleString([], {
          dateStyle: 'short',
          timeStyle: 'short',
        });
        let appointmentObject = {
          appointmentId: `${i}`,
          businessName: `${appointment.businessName}`,
          appointmentDate: `${appointmentDateString}`,
          appointmentPrice: `$26.94`,
        };
        if (appointmentDate > new Date(new Date().toDateString())) {
          upcomingAppointments.push(appointmentObject);
        } else {
          pastAppointments.push(appointmentObject);
        }
      }

      this.setState((state) => {
        return {
          upcomingAppointments: [...upcomingAppointments],
          pastAppointments: [...pastAppointments],
        };
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
              {/* {this.state.upcomingAppointments.map((appointment) => (
                                <AppointmentItem businessName={appointment.businessName} appointmentDate={appointment.appointmentDate} appointmentPrice={appointment.appointmentPrice}/>
                            ))} */}
            </List>
          </div>
          <div className="past-appointments">
            <h3>Past</h3>
            <List>
              {/* {this.state.pastAppointments.map((appointment) => (
                                <AppointmentItem businessName={appointment.businessName} appointmentDate={appointment.appointmentDate} appointmentPrice={appointment.appointmentPrice}/>
                            ))} */}
            </List>
          </div>
        </div>
      </Container>
    );
  }
}

export default AppointmentsPage;
