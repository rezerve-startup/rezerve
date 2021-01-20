import React from 'react';
import { TextField, Checkbox } from '@material-ui/core/';
import './customerSignup.css';

// const useStyles = makeStyles(theme => ({
//     root: {
//       background: "black"
//     },
//     input: {
//       color: "white"
//     }
// }));

function CustomerCreationPage() {
  return (
    <div className="main">
      <div className="page-items">
        <h1>Account Info</h1>
      </div>

      <div className="page-items">
        <h2>Name</h2>
        <TextField color="secondary" fullWidth />
      </div>

      <div className="page-items">
        <h2>Phone Number</h2>
        <TextField color="secondary" fullWidth />
      </div>

      <div className="checkbox">
        <Checkbox />
        <span>Not Now</span>
      </div>

      <div className="page-items">
        <h2>Email Address</h2>
        <TextField color="secondary" fullWidth />
      </div>

      <div className="page-items">
        <h2>Address/Location</h2>
        <TextField color="secondary" fullWidth />
      </div>

      <div>
        <button className="button">Find Stylists & Book</button>
      </div>
    </div>
  );
}

export default CustomerCreationPage;
