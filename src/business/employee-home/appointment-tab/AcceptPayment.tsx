import React from 'react'
import {useStripe} from '@stripe/react-stripe-js';
import {Button} from '@material-ui/core';
import { useEffect } from 'react';


export default function AcceptPayment(props){
    // Create PaymentIntent as soon as the page loads
    // Local testing
    // http://localhost:4242/charge-card-off-session
  
    // Live site
    // https://rezerve-startup-api.herokuapp.com/charge-card-off-session
    
    const [clientSecret, setClientSecret] = React.useState<string>('');
    var PUBLIC_KEY = ''
    const stripe = useStripe();
    
    useEffect(() => {
      console.log(props.cID)
      
      window.fetch('https://rezerve-startup-api.herokuapp.com/charge-card-off-session', {
        // Use one of the links above for local/live
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
         
        body: JSON.stringify({cID : props.cID}),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret)
        PUBLIC_KEY = data.publicKey
      });
    }, []);

    console.log(4, PUBLIC_KEY)

      const handlePayment = async (ev) => {
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
        });
      }
      
      
        return(<Button onClick={handlePayment}>Confirm Appointment</Button>)
  }