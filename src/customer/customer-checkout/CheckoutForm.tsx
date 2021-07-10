import React, { useEffect } from 'react';
import {
  Snackbar,
  makeStyles,
  Theme,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

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
}));

export default function CheckoutForm(props) {
  const [succeeded, setSucceeded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState<boolean>(false);
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [clientSecret, setClientSecret] = React.useState<string>('');
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

  const sentPrice: number = props.price;
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    // Local testing
    // http://localhost:4242/create-payment-intent

    // Live site
    // https://rezerve-startup-api.herokuapp.com/create-payment-intent
    window
      .fetch('https://rezerve-startup-api.herokuapp.com/create-payment-intent', {
        // Use one of the links above for local/live
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({ servicePrice: sentPrice }),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
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
        handleActions: false
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
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <form id="payment-form" onSubmit={handleSubmit}>
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
    </div>
  );
}