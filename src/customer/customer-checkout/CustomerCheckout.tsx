import React, { createRef } from 'react';
import {
  Divider,
  Checkbox,
  TextField,
  Dialog,
  DialogContent,
  Button,
  DialogActions,
  Typography,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  // tslint:disable-next-line: no-submodule-imports
} from '@material-ui/core/';
// tslint:disable-next-line: no-submodule-imports
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import './CustomerCheckout.css';
import moment, { Moment } from 'moment';

const promise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);

function getSteps() {
  return ['Review Booking', 'Payment Information', 'Confirm Booking'];
}

function getStepContent(stepIndex: number, setCustomerPaid, businessName, appointmentDateTime, employeeName, service) {
  switch (stepIndex) {
    case 0:
      return <ConfirmationCard businessName={businessName} appointmentDateTime={appointmentDateTime} employeeName={employeeName} service={service} />;
    case 1:
      return <StripePaymentSetup paymentSuccess={setCustomerPaid} />;
    case 2:
      return <BookingConfirmation businessName={businessName} appointmentDateTime={appointmentDateTime} employeeName={employeeName} service={service} />;
    default:
      return 'Our apologies, there has been a mishap with the booking process. Please try again later.';
  }
}

function StripePaymentSetup(props) {
  // tslint:disable-next-line: no-shadowed-variable
  const classes = useStyles();
  return (
    <div className="App">
      <Elements stripe={promise}>
        <CheckoutForm paymentSuccess={props.paymentSuccess} />
      </Elements>
    </div>
  );
}

const ConfirmationCard = (props: any) => {
  // tslint:disable-next-line: no-shadowed-variable
  const classes = useStyles();

  return (
    <div className={classes.itemCard}>
      <div className={classes.items}>
        <h2>
          <strong>{props.businessName}</strong>
        </h2>
      </div>

      <div className={classes.items}>
        <h2>
          <strong>{props.employeeName}</strong>
        </h2>
      </div>

      <div className={classes.items}>
        <h3>
          <strong>{'Tests'}</strong>
        </h3>
        <div className={classes.priceAlign}>
          <h3 className={classes.stat}>${props.service.price}</h3>
        </div>
      </div>

      <Divider className={classes.divider0} />
      <div className={classes.items}>
        <h3>
          <strong>{props.appointmentDateTime.format('ddd MM/DD/YYYY')}</strong>
        </h3>
        <div className={classes.timeAlign}>
          <h3 className={classes.stat}>{props.appointmentDateTime.format('h:mm A')}</h3>
        </div>
      </div>
    </div>
  );
}

const BookingConfirmation = (props: any) => {
  // tslint:disable-next-line: no-shadowed-variable
  const classes = useStyles();
  return (
    <div>
      <ConfirmationCard businessName={props.businessName} appointmentDateTime={props.appointmentDateTime} employeeName={props.employeeName} service={props.service} />
      <div className={classes.itemPlus1}>
        <span>
          <h3>
            <strong>Receive Text Reminders/Updates</strong>
            <Checkbox className={classes.checkbox} />
          </h3>
        </span>
      </div>

      <div className={classes.phoneField}>
        <TextField type="tel" placeholder="Phone Number" />
      </div>
    </div>
  );
}

const CustomerCheckout = (props: any) => {
  const theme = useTheme();
  // tslint:disable-next-line: no-shadowed-variableF
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [customerPaid, setCustomerPaid] = React.useState<boolean>(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const openOnClick = () => {
    setOpen(true);
    handleReset();
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (props.businessName && props.appointmentDateTime && props.employeeName && props.service) {

    return (
      <>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel={true}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Typography component={'span'} className={classes.instructions}>
            {getStepContent(activeStep, setCustomerPaid, props.businessName, props.appointmentDateTime, props.employeeName, props.service)}
          </Typography>
        </DialogContent>
  
        <DialogActions>
          <div>
            {activeStep !== 0 && 
              <Button
                onClick={activeStep === 0 ? handleClose : handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
            }
  
            <Button
              variant="contained"
              color="primary"
              disabled={activeStep === steps.length - 2 ? !customerPaid : false}
              onClick={
                activeStep === steps.length - 1 ? props.bookAppointment : handleNext
              }
            >
              {activeStep === steps.length - 1 ? 'Confirm & Book' : 'Next'}
            </Button>
          </div>
        </DialogActions>
      </>
    );
  } else {
    return <></>
  }

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
    height: '10px',
    width: '95%',
    margin: 'auto',
  },

  items: {
    display: 'flex',
    padding: '5px',
  },

  stat: {
    left: '175px',
    fontWeight: 'bold',
  },

  priceAlign: {
    position: 'relative',
    marginLeft: '150px',
  },

  timeAlign: {
    right: '60px',
    position: 'relative',
    left: '93px',
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
    paddingTop: '40px',
    paddingLeft: '40px',
    paddingBottom: '10px',
  },

  checkbox: {
    fontWeight: 'bold',
    position: 'relative',
  },

  phoneField: {
    display: 'flex',
    paddingTop: '10px',
    paddingLeft: '40px',
    paddingBottom: '20px',
    WebkitAppearance: 'none',
    margin: '0',
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

export default CustomerCheckout;