import React, {useEffect} from 'react'
import {useStripe} from '@stripe/react-stripe-js';
import {Button, CircularProgress} from '@material-ui/core';

export default function AcceptPayment(props:any){
    // Create PaymentIntent as soon as the page loads
    // Local testing
    // http://localhost:4242/charge-card-off-session
  
    // Live site
    // https://rezerve-startup-api.herokuapp.com/charge-card-off-session
    
    const [clientSecret, setClientSecret] = React.useState<string>('');
    const [error, setError] = React.useState<string | null>('');
    const [loaded, setLoaded] = React.useState<boolean>(false)
    const stripe = useStripe();
    
    useEffect(() => {
      fetch('https://rezerve-startup-api.herokuapp.com/create-setup-intent', {
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
        setLoaded(true)
      });
    }, []);


      const handleConfirm = async (ev) => {
        ev.preventDefault();
        
        await stripe!.confirmCardPayment(clientSecret)
        .then((result) => {
          if (result.error) {
            props.this.forceCancelAppointment();
          } else {
            console.log("Payment Processed")
            props.this.updateAppointmentStatus();
          }
        })
        .catch((e) => {
          console.log(`Error: ${e.message}`);
        })       
      }
        return(
        <div>
          {loaded ? (
            <Button onClick={handleConfirm}>
            Confirm Appointment
          </Button>
          ) : (<CircularProgress/>)}
        </div>
        )
  }