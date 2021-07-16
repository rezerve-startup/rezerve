import {
  Button,
  DialogActions, DialogContent, Divider, Step,
  StepLabel, Stepper, Typography
} from '@material-ui/core/';
// tslint:disable-next-line: no-submodule-imports
import { makeStyles } from '@material-ui/core/styles';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import CheckoutForm from './CheckoutForm';
import './CustomerCheckout.css';
import moment, { Moment } from 'moment';
import { PinDropSharp } from '@material-ui/icons';
const PUBLIC_KEY = "pk_test_51IT9oWG4OM4l9C1dre9yGOSSd1MtmDOWcGsjlv7Exe6u46E2UpIjt92w9zO7ld2i0v1os1NaYwWX48MxqbhvRoq8009WuwQftX"
const promise = loadStripe(PUBLIC_KEY);

function getSteps() {
  return ['Review Booking', 'Payment Information'];
}

function getStepContent(stepIndex: number, setCustomerPaid, businessName, appointmentDateTime, employeeName, service, appt) {
  switch (stepIndex) {
    case 0:
      return <ConfirmationCard businessName={businessName} appointmentDateTime={appointmentDateTime} employeeName={employeeName} service={service} />;
    case 1:
      return <StripePaymentSetup paymentSuccess={setCustomerPaid} price={service.price} this={appt}/>;
    case 2:
      return <BookingConfirmation businessName={businessName} appointmentDateTime={appointmentDateTime} employeeName={employeeName} service={service} />;
    default:
      return 'Our apologies, there has been a mishap with the booking process. Please try again later.';
  }
}

function StripePaymentSetup(props) {
  const price:number = props.price;
  return (
    <div className="App">
      <Elements stripe={promise}>
        <CheckoutForm paymentSuccess={props.paymentSuccess} price={price} this={props.this}/>
      </Elements>
    </div>
  );
}

const ConfirmationCard = (props: any) => {
  // tslint:disable-next-line: no-shadowed-variable
  const classes = useStyles();

  return (
    <div className={classes.itemCard}>
      <div className={classes.confirmationBusinessName}>
        <div>{props.businessName}</div>
      </div>

      <div className={classes.confirmationEmployeeName}>
        <div>{props.employeeName}</div>
      </div>

      <div className={classes.confirmationAppointmentDate}>
        <div>{props.appointmentDateTime.format('ddd MM/DD/YYYY')}</div>
        <div>{props.appointmentDateTime.format('h:mm A')}</div>
      </div>
      <Divider className={classes.divider0} />
      <div className={classes.confirmationServicePrice}>
        <div>{props.service.name}</div>
        <div>${props.service.price}</div>
      </div>

      <div className={classes.confirmationServicePrice}>
        <div>Booking Fee</div>
        <div>$0.75</div>
      </div>
      <Divider className={classes.divider1} />
      <div className={classes.confirmationServicePrice}>
        <div>*Payment Due</div>
        <div>$0.75</div>
      </div>

      <Divider className={classes.divider0} />
      
      <div style={{textAlign: 'center'}}>
        <Typography variant="caption">
          *Your payment in Step 2 is only for the Booking Fee. Service payment will happen at {props.businessName}.
        </Typography>
      </div>

    </div>
  );
}

const BookingConfirmation = (props: any) => {
  return (
    <div>
      <ConfirmationCard businessName={props.businessName} appointmentDateTime={props.appointmentDateTime} employeeName={props.employeeName} service={props.service} />
    </div>
  );
}

const CustomerCheckout = (props: any) => {
  // tslint:disable-next-line: no-shadowed-variableF
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [customerPaid, setCustomerPaid] = React.useState<boolean>(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setCustomerPaid(false)
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClose = () => {
    console.log("closed")
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
            {getStepContent(activeStep, setCustomerPaid, props.businessName, props.appointmentDateTime, props.employeeName, props.service, props.this)}
          </Typography>
        </DialogContent>
  
        <DialogActions>
          <div>
            {activeStep !== 0 && customerPaid === false &&
              <Button
                onClick={activeStep === 0 ? handleClose : handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
            }
  
            {activeStep === 0 &&
            <Button
            variant="contained"
            color="primary"
            onClick={
              handleNext
            }
          >
            Next
          </Button>}
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
    background: 'white',
    color: 'white',
    height: '30px',
    width: '95%',
    margin: 'auto',
  },

  divider1: {
    // Theme Color, or use css color in quote
    background: theme.palette.primary.dark,
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
    fontSize: '18pt',
    textAlign: 'center'
  },

  confirmationEmployeeName: {
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem',
    margin: '4px'
  },

  confirmationServicePrice: {
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '4px'
  },

  confirmationAppointmentDate: {
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '4px'
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
    border: "1px solid",
    background: 'white',
    color: theme.palette.secondary.dark,
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

export default CustomerCheckout;
