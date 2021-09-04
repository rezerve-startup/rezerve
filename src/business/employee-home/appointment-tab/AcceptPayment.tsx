import React, {useEffect} from 'react'
import {useStripe} from '@stripe/react-stripe-js';
import {Button, CircularProgress, Typography} from '@material-ui/core';
import { firestore } from '../../../config/FirebaseConfig';
import firebase from 'firebase';
export default function AcceptPayment(props:any){
    // Create PaymentIntent as soon as the page loads
    // Local testing
    // http://localhost:4242/charge-card-off-session
  
    // Live site
    // https://rezerve-startup-api.herokuapp.com/charge-card-off-session
    
    const [clientSecret, setClientSecret] = React.useState<string>('');
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [succeeded, setSucceeded] = React.useState<boolean>(false);
    const stripe = useStripe();
    
    useEffect(() => {
      // Create PaymentIntent as soon as the page loads
    // Local testing
    // http://localhost:4242/create-payment-intent

    // Live site
    // https://rezerve-startup-api.herokuapp.com/create-payment-intent
      fetch('https://rezerve-startup-api.herokuapp.com/create-payment-intent', {
        // Use one of the links above for local/live
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
         
        body: JSON.stringify({action: 'paymentIntent', cID : props.cID}),
      },
        
      )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret)
        //setPublicKey(data.publicKey)
        setSucceeded(data.succeeded)
        setLoaded(true)
      });
    }, []);

    console.log(succeeded)
    
      const handleConfirm = async (ev) => {
        ev.preventDefault();
        stripe!
        .confirmCardPayment(clientSecret)
        .then((result) => {
          if (result.error) {
            // setSnackSeverity('error');
            console.log(`Erroree: ${result.error.message}`);
          } else {
            // setError(null);
            // setSucceeded(true);
            // setSnackSeverity('success');
            // setSnackMessage('Card processed');
            // props.paymentSuccess(true);
            console.log("Yippie Kay Yay")
          }
        })
        .catch((e) => {
          // setSnackSeverity('error');
          console.log(`Error: ${e.message}`);
        })
        .finally(() => {
          // setProcessing(false);
          // setOpen(true);
          console.log("Payment Success")
          if(succeeded == true){
            props.this.updateAppointmentStatus();
          }
        });
      }

      const handleCatch = () => {
        props.this.updateAppointmentStatus();
      }
        return(
          <div>
            {loaded ? (
              <div>
                {succeeded === true ? (
                  <Button onClick={handleConfirm} color="secondary" variant="contained" style={{marginTop: '5px'}}>Confirm Appointment</Button>
                ) : (
                  <Button onClick={handleCatch} color="secondary" variant="contained" style={{marginTop: '5px'}}>Confirm Appointment</Button> 
                )}
              </div>
            ) : (<CircularProgress/>)}
          </div>
        )
  }