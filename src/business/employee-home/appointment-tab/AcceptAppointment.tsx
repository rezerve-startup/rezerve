import React from 'react';
import {
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core/';
// tslint:disable-next-line: no-submodule-imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import AcceptPayment from './AcceptPayment';
const PUBLIC_KEY = "pk_live_51IT9oWG4OM4l9C1dre9yGOSSd1MtmDOWcGsjlv7Exe6u46E2UpIjt92w9zO7ld2i0v1os1NaYwWX48MxqbhvRoq8009WuwQftX"
const TEST_KEY = "pk_test_51IT9oWG4OM4l9C1dre9yGOSSd1MtmDOWcGsjlv7Exe6u46E2UpIjt92w9zO7ld2i0v1os1NaYwWX48MxqbhvRoq8009WuwQftX"
const promise = loadStripe(PUBLIC_KEY);



function StripePaymentSetup(props) {
  // tslint:disable-next-line: no-shadowed-variable
  return (
    <div className="App">
      <Elements stripe={promise}>
        <AcceptPayment cID={props.cID} this={props.this} appt={props.appt}/>
      </Elements>
    </div>
  );
}



const AcceptAppointment = (props: any) => {
  // tslint:disable-next-line: no-shadowed-variableF
    return (
      <>
        <DialogTitle>Appointment Accepted</DialogTitle>
          <DialogContent>
          <DialogContentText>This appointment has been accepted</DialogContentText>
            <Typography align="center">
              <StripePaymentSetup cID={props.appt.cID} this={props.this} appt={props.appt}/>
            </Typography>
            
          </DialogContent>
          
      </>
    );
}

export default AcceptAppointment;
