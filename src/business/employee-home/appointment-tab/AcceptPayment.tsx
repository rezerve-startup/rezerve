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
        //setPublicKey(data.publicKey)
        setSucceeded(data.succeeded)
        setLoaded(true)
      });
    }, []);

    console.log(succeeded)
    
      const handleConfirm = () => {
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

      const handleCancel = () => {
        const apptRef = firestore.collection('appointments').doc(props.appt.appointmentId)
        apptRef.update({
          status: 'cancelled',
          cID: firebase.firestore.FieldValue.delete()
        }).then(() => {
          apptRef.get().then(() => {
            props.this.forceCancelAppointment();
          })
        })
        
      }
        return(
          <div>
            {loaded ? (
              <div>
                {succeeded === true ? (
                  <Button onClick={handleConfirm}>Confirm Appointment</Button>
                ) : (
                  <div>
                    <div style={
                  {border: "4px solid black",
                  background: "#FF6060",
                  color: "#e2e2e2",
                  margin: 'auto',
                  width: '90%',
                  marginTop: '10px'}}>

                      <Typography>There has been an error with the booking process on the client's end. 
                      </Typography>
                  </div>
                  <Button onClick={handleCancel} color="secondary" variant="contained" style={{marginTop: '5px'}}>Ok</Button>
                  </div>
                )}
              </div>
            ) : (<CircularProgress/>)}
          </div>
        )
  }