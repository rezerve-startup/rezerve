import React, {useEffect} from 'react'
import {useStripe} from '@stripe/react-stripe-js';
import {Button} from '@material-ui/core';


export default function AcceptPayment(props:any){
    // Create PaymentIntent as soon as the page loads
    // Local testing
    // http://localhost:4242/charge-card-off-session
  
    // Live site
    // https://rezerve-startup-api.herokuapp.com/charge-card-off-session
    
    const [clientSecret, setClientSecret] = React.useState<string>('');
    const [publicKey, setPublicKey] = React.useState<string>('');
    const [succeeded, setSucceeded] = React.useState<boolean>(false);
    const stripe = useStripe();
    
    useEffect(() => {
      console.log(props.cID)
      
      fetch('https://rezerve-startup-api.herokuapp.com/create-setup-intent', {
        // Use one of the links above for local/live
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
         
        body: JSON.stringify({action: 'paymentIntent', cID : props.cID}),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret)
        //setPublicKey(data.publicKey)
        setSucceeded(data.succeeded)
      });
    }, []);

    console.log(4, succeeded)

      const handleConfirm = async (ev) => {
        ev.preventDefault();
        stripe!
        .confirmCardPayment(clientSecret)
        .then((result) => {
          if (result.error) {
            // setSnackSeverity('error');
            console.log(`Error: ${result.error.message}`);
          } else {
            // setError(null);
            // setSucceeded(true);
            // setSnackSeverity('success');
            // setSnackMessage('Card processed');
            // props.paymentSuccess(true);
          }
        })
        .catch((e) => {
          // setSnackSeverity('error');
          console.log(`Error: ${e.message}`);
        })
        .finally(() => {
          // setProcessing(false);
          // setOpen(true);
          console.log("Payment Processed")
          props.this.updateAppointmentStatus();
        });
       
      }
        return(<Button onClick={handleConfirm}>Confirm Appointment</Button>)
  }