import React from 'react';

class AppointmentItem extends React.Component {

    render() {
        console.log(this.props);
        return (
            <div className="appointment-item">
                <p className="business-picture"><i>Imagine there is a picture here</i></p>
                <div className="appointment-overview">
                    {/* <p className="business-name">{this.props.businessName}</p>
                    <p className="appointment-info">{this.props.appointmentDate}</p>
                    <p className="appointment-info">{this.props.appointmentPrice}</p> */}
                </div>
            </div>
        )
    }
}

export default AppointmentItem;