import React from 'react';
// import * as FaIcons from 'react-icons/fa'
import {
  Divider,
  Checkbox,
  TextField,
  Dialog,
  DialogContent,
  Button,
  DialogTitle,
  DialogActions,
  Typography,
  Fab,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
} from '@material-ui/core/';
// tslint:disable-next-line: no-submodule-imports
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "./CustomerCheckout.css";

const promise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");



function getSteps() {
  return ['Review Booking', 'Payment Setup', 'Confirm'];
}

function getStripeObject(){
  return loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
}

function getStepContent(stepIndex: number) {
  switch (stepIndex) {
    case 0:
      return <ConfirmationCard />;
    case 1:
      return <StripePaymentSetup />;
    case 2:
      return <BookingConfirmation />;
    default:
      return 'Our apologies, there has been a mishap with the booking process. Please try again later.';
  }
}
function StripePaymentSetup() {
  // tslint:disable-next-line: no-shadowed-variable
  const classes = useStyles();
  return (
    <div className="App">
      <Elements stripe={promise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}


function ConfirmationCard() {
  // tslint:disable-next-line: no-shadowed-variable
  const classes = useStyles();

  return (
    <div className={classes.itemCard}>
      <div className={classes.items}>
        <h2>
          <strong>Sally's Hair Salon</strong>
        </h2>
      </div>

      <div className={classes.items}>
        <h2>
          <strong>Cindy</strong>
        </h2>
      </div>

      <div className={classes.items}>
        <h3>
          <strong>Haircut</strong>
        </h3>
        <div className={classes.priceAlign}>
          <h3 className={classes.stat}>$35.00</h3>
        </div>
      </div>

      <Divider className={classes.divider0} />
      <div className={classes.items}>
        <h3>
          <strong>Sat 1/16/2021</strong>
        </h3>
        <div className={classes.timeAlign}>
          <h3 className={classes.stat}>4:00pm</h3>
        </div>
      </div>
    </div>
  );
}

function BookingConfirmation(){
  // tslint:disable-next-line: no-shadowed-variable
  const classes = useStyles();
  return (
    <div>
      <ConfirmationCard />
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

function CustomerCheckout() {
  const theme = useTheme();
  // tslint:disable-next-line: no-shadowed-variable
  const classes = useStyles();
  const fullscreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const Stripe = getStripeObject();

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

  var backFunction = () => handleBack;

  return (
    <div>
      <script src="https://js.stripe.com/v3/"/>
      <Button variant="contained" color="primary" onClick={openOnClick}>
        Open Checkout
      </Button>
      <Dialog
        open={open}
        fullScreen={fullscreen}
        className={classes.receiptPage}
      >
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel={true}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Typography className={classes.instructions}>
            {getStepContent(activeStep)}
          </Typography>
        </DialogContent>

        <DialogActions>
          <div>
            <Button
              onClick={activeStep === 0 ? handleClose : handleBack}
              className={classes.backButton}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={
                activeStep === steps.length - 1 ? handleClose : handleNext
              }
            >
              {activeStep === steps.length - 1 ? 'Confirm & Book' : 'Next'}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
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
    height: '10px',
    width: '95%',
    margin: 'auto',
  },

  receiptPage: {
    background: 'white',
    height: '100vh',
    width: '100vw',
    color: 'black',
    textAlign: 'center',
    alignItems: 'center',
    position: 'fixed',
  },

  items: {
    display: 'flex',
    padding: '5px',
  },

  stat: {
    left: '175px',
    fontWeight: 'bold',
    position: 'absolute',
  },

  priceAlign: {
    position: 'relative',
  },

  timeAlign: {
    right: '60px',
    position: 'relative',
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

