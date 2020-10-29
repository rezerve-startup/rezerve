import { Container } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import './AppointmentsPage.css';
import AppointmentItem from './AppointmentItem';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

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
        upcomingAppointments: DATA,
        pastAppointments: DATA
    };

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
                                <AppointmentItem businessName={appointment.businessName} appointmentDate={appointment.appointmentDate} appointmentPrice={appointment.appointmentPrice}/>
                            ))}
                        </List>
                    </div>
                    <div class="past-appointments">
                        <h3>Past</h3>
                        <List>
                            {this.state.upcomingAppointments.map((appointment) => (
                                <AppointmentItem businessName={appointment.businessName} appointmentDate={appointment.appointmentDate} appointmentPrice={appointment.appointmentPrice}/>
                            ))}
                        </List>
                    </div>
                </div>
            </Container>
        )
    }
}

export default AppointmentsPage;
