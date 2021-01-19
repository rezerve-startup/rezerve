import React, { Component } from "react";
// import { Form, Image } from '../../../customer/header/node_modules/react-bootstrap'
import "./BusinessInfoDetails.css";

// const employees = [
//   {
//     name: "Cindy",
//     picture: "assets/cat1.jpg",
//     schedule: "",
//   },
//   {
//     name: "Joel",
//     picture: "assets/cat2.jpg",
//     schedule: "",
//   },
//   {
//     name: "Mark",
//     picture: "assets/cat4.jpg",
//     schedule: "",
//   },
// ];

// const employeeList = employees.map(
//   employee => {
//     return <Form className="employee">
//       <Image width="30%" height="10%" src={employee.picture} thumbnail />
//       <Form.Group controlId="formBasicCheckbox">
//         <Form.Check type="checkbox" label={employee.name} />
//       </Form.Group>
//     </Form>;
//   }
// );

class BusinessInfoDetails extends Component {
  render() {
    return (
      <div className="business-info-details-page">
        <div className="employee-listing">
          {/* {employeeList} */}
        </div>
      </div>
    );
  }
}

export default BusinessInfoDetails;
