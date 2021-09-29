import {
  Button,
  CircularProgress, makeStyles, Snackbar, Theme, Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  spinner: {
    marginLeft: theme.spacing(2),
  },
  itemCard: {
    border: "4px solid black",
    background: theme.palette.primary.main,
    color: theme.palette.secondary.light,
    margin: 'auto',
    width: '90%',
    marginTop: '10px'
  },
}));

export default function CheckoutForm(props) {
  const [succeeded, setSucceeded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState<boolean>(false);
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [clientSecret, setClientSecret] = React.useState<string>('');
  const [cID, setCID] = React.useState<string>('');
  const [appointmentId, setAppointmentId] = React.useState<string>('');
  const [snackSeverity, setSnackSeverity] = React.useState<
    'error' | 'success' | 'info' | 'warning' | undefined
  >(undefined);
  const [snackMessage, setSnackMessage] = React.useState<string>('');
  const stripe = useStripe();
  const elements = useElements();
  const [open, setOpen] = React.useState(false);

  // Spinner on button
  // tslint:disable-next-line: no-shadowed-variable
  const SpinnerAdornment = (props: any) => {
    // tslint:disable-next-line: no-shadowed-variable
    const classes = useStyles();
    return <CircularProgress className={classes.spinner} size={20} />;
  };

  // tslint:disable-next-line: no-shadowed-variable
  const AdornedButton = (props) => {
    const { children, loading, ...rest } = props;
    return (
      <Button {...rest}>
        {children}
        {loading && <SpinnerAdornment {...rest} />}
      </Button>
    );
  };

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    // Local testing
    // http://localhost:4242/create-setup-intent

    // Live site
    // https://rezerve-startup-api.herokuapp.com/create-setup-intent
    fetch('https://rezerve-startup-api.herokuapp.com/create-setup-intent', {
        // Use one of the links above for local/live
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({ action: 'setupIntent'}),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
        setCID(data.cID)
      });
  }, []);
  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#32325d',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);

    const cardElement = elements!.getElement('card');
    stripe!
      .confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement!,
        },
      },
      {
    
      })
      .then((result) => {
        if (result.error) {
          setSnackSeverity('error');
          setSnackMessage(`Error: ${result.error.message}`);
        } else {
          setError(null);
          setSucceeded(true);
          setSnackSeverity('success');
          setSnackMessage('Card processed');
          props.paymentSuccess(true);
        }
      })
      .catch((e) => {
        setSnackSeverity('error');
        setSnackMessage(`Error: ${e.message}`);
      })
      .finally(() => {
        setProcessing(false);
        setOpen(true);
      });
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      setOpen(false)
      return;
    }

    //setOpen(false);
  };

  const handleConfirm = () => {
    props.this.bookAppointment();
    
      // if(props.this.props.user !== undefined){
      //   const customerRef = firestore.collection('customers').doc(`${props.this.props.user.customerId}`)
      //   customerRef.get().then((docRef) => {
      //     const customerAppointments: string[] = docRef.data()?.appointments
      //     setAppointmentId(customerAppointments[customerAppointments.length -1])
      //     console.log(appointmentId)
      //   })
      // }
    
    }
    const classes = useStyles();
  return (
    <div>
      
      <form id="payment-form" onSubmit={handleSubmit}>
        {!(error === null  && open)  && 
        <div>
          <CardElement
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
        />
      
        <AdornedButton
          disabled={processing || disabled || succeeded}
          id="submit"
          color="primary"
          variant="contained"
          type="submit"
          loading={processing}
          fullWidth={true}
        >
          {processing ? '' : 'Pay now'}
        </AdornedButton>
    
        <div className={classes.itemCard}>
            <Typography  variant="body1" align="center">Booking Fee will only be charged after your stylist accepts the appointment.</Typography>
        </div>
        </div>
    }
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            variant="filled"
            elevation={6}
            severity={snackSeverity}
          >
            {snackMessage}
          </Alert>
        </Snackbar>
      </form>
      

      {error === null  && open &&
          <Typography align="center">

          {/* Maybe Add Card Here */}

            <Button
            variant="contained"
            color="primary"
            onClick={
              handleConfirm
            }
          >
            {'Confirm & Book'}
          </Button>
          </Typography>      
      }
    </div>
  );
}