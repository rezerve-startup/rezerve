import React, { createRef } from 'react';
import {
  DialogContent,
  Button,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core/';
// tslint:disable-next-line: no-submodule-imports
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import AcceptPayment from './AcceptPayment';
const PUBLIC_KEY = "pk_test_51IT9oWG4OM4l9C1dre9yGOSSd1MtmDOWcGsjlv7Exe6u46E2UpIjt92w9zO7ld2i0v1os1NaYwWX48MxqbhvRoq8009WuwQftX"
const promise = loadStripe(PUBLIC_KEY);



function StripePaymentSetup(props) {
  // tslint:disable-next-line: no-shadowed-variable
  const classes = useStyles();
  const price:number = props.price;
  return (
    <div className="App">
      <Elements stripe={promise}>
        <AcceptPayment cID={props.cID} this={props.this}/>
      </Elements>
    </div>
  );
}



const AcceptAppointment = (props: any) => {
  const theme = useTheme();
  // tslint:disable-next-line: no-shadowed-variableF
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

    return (
      <>
        <DialogTitle>Accept Appointment</DialogTitle>
          <DialogContent>
          <DialogContentText>Would you like to accept this appointment?</DialogContentText>
            <Typography align="center">
              <StripePaymentSetup cID={props.appt.cID} this={props.this}/>
            </Typography>
            
          </DialogContent>
          
      </>
    );
}

const useStyles = makeStyles((theme) => ({
  divider0: {
    // Theme Color, or use css color in quote
    background: '#c8c8c8',
    color: 'white',
    height: '30px',
    width: '95%',
    margin: 'auto',
  },

  divider1: {
    // Theme Color, or use css color in quote
    background: 'white',
    color: 'white',
    height: '2px',
    width: '98%',
    margin: 'auto',
  },

  items: {
    display: 'flex',
    padding: '5px',
  },

  confirmationBusinessName: {
    fontWeight: 'bold',
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem',
    fontSize: '18pt'
  },

  confirmationEmployeeName: {
    fontWeight: 'bold',
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem'
  },

  confirmationServicePrice: {
    fontWeight: 'bold',
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  confirmationAppointmentDate: {
    fontWeight: 'bold',
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  priceAlign: {
    position: 'relative',
    marginLeft: '150px',
  },

  closeIcon: {
    right: '50px',
    position: 'absolute',
    fontSize: '40px',
    color: 'black',
  },

  receipt: {
    borderStyle: 'solid',
  },

  itemCard: {
    background: '#c8c8c8',
    color: 'white',
    margin: 'auto',
    width: '90%',
  },

  itemPlus: {
    display: 'flex',
    padding: '40px',
  },

  itemPlus1: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    marginTop: '1rem'
  },

  checkbox: {
    fontWeight: 'bold',
  },

  phoneField: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    WebkitAppearance: 'none',
    marginBottom: '1rem'
  },

  button: {
    background: '#ff4949',
    border: 'none',
    color: 'white',
    padding: '12px 34px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '14pt',
  },

  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default AcceptAppointment;
