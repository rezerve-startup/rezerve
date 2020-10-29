import React from 'react';
import './AppointmentItem.css';


class AppointmentItem extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div class="appointment-item">
                <p class="business-picture"><i>Imagine there is a picture here</i></p>
                <div class="appointment-overview">
                    <p class="business-name">{this.props.businessName}</p>
                    <p class="appointment-info">{this.props.appointmentDate}</p>
                    <p class="appointment-info">{this.props.appointmentPrice}</p>
                </div>
            </div>
        )
    }
}

export default AppointmentItem;
