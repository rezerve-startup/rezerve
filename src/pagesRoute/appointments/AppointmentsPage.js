import { Container } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import './AppointmentsPage.css';
import AppointmentItem from './AppointmentItem';

import List from '@material-ui/core/List';
import { firestore } from '../../config/FirebaseConfig';

let DATA = [
    { 
        appointmentId: 0,
        businessName: '2cut Barbershop',
        appointmentDate: '11/21/21',
        appointmentPrice: '$26.94'
    },
    { 
        appointmentId: 1,
        businessName: '2cut Barbershop',
        appointmentDate: '11/21/21',
        appointmentPrice: '$26.94'
    },
    { 
        appointmentId: 2,
        businessName: '2cut Barbershop',
        appointmentDate: '11/21/21',
        appointmentPrice: '$26.94'
    },
    { 
        appointmentId: 3,
        businessName: '2cut Barbershop',
        appointmentDate: '11/21/21',
        appointmentPrice: '$26.94'
    },
    { 
        appointmentId: 4,
        businessName: '2cut Barbershop',
        appointmentDate: '11/21/21',
        appointmentPrice: '$26.94'
    },
    { 
        appointmentId: 5,
        businessName: '2cut Barbershop',
        appointmentDate: '11/21/21',
        appointmentPrice: '$26.94'
    },
]

class AppointmentsPage extends React.Component {

    state = {
        upcomingAppointments: [],
        pastAppointments: DATA
    };

    componentDidMount() {
        firestore.collection('users').onSnapshot(snapshot => {
            const appointments = snapshot.docs[0].data().appointments;
            console.log(appointments);

            let upcomingAppointments = [];
            for (let i = 0; i < appointments.length; i++) {
                let appointment = appointments[i];
                let appointmentDate = appointment.dateTime.toDate().toLocaleString([], {dateStyle: 'short', timeStyle: 'short'});
                let appointmentToShow = {
                    appointmentId: `${i}`,
                    businessName: `${appointment.businessName}`,
                    businessDate: `${appointmentDate}`
                }
                upcomingAppointments.push(appointmentToShow);
            }

            this.setState((state) => {
                return {
                    upcomingAppointments: [...upcomingAppointments]
                }
            })
        })
    }

    render() {
        return (
            <Container>
                <div class="page-items">
                    <div class="appointment-header">
                        <h2>Appointments</h2>
                        <CloseIcon />
                    </div>
                    <div class="upcoming-appointments">
                        <h3>Upcoming</h3>
                        <List>
                            {this.state.upcomingAppointments.map((appointment) => (
                                <AppointmentItem businessName={appointment.businessName} appointmentDate={appointment.businessDate} appointmentPrice={'$26.94'}/>
                            ))}
                        </List>
                    </div>
                    <div class="past-appointments">
                        <h3>Past</h3>
                        <List>
                            {this.state.pastAppointments.map((appointment) => (
                                <AppointmentItem businessName={appointment.businessName} appointmentDate={appointment.dateTime} appointmentPrice={'$26.94'}/>
                            ))}
                        </List>
                    </div>
                </div>
            </Container>
        )
    }
}

export default AppointmentsPage;
