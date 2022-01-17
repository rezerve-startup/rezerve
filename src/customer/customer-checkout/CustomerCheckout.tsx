import {
  Button, Card, CardContent, CardActions,
  DialogActions, DialogContent, Divider, Step,
  StepLabel, Stepper, Typography, TextField
} from '@material-ui/core/';
import LoginDefault from '../../shared/login/loginDefault';
import SignUpPage from '../../shared/sign-up/SignUpPage';
// tslint:disable-next-line: no-submodule-imports
import { makeStyles } from '@material-ui/core/styles';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import loginDefault from '../../shared/login/loginDefault';
import CheckoutForm from './CheckoutForm';
const PUBLIC_KEY = "pk_live_51IT9oWG4OM4l9C1djPJNEIxFEuRenRxG4YxAr4FOEfpGWsWCQ47s0L606rET7gbRBEmxvVYhvIsuxbYwIfQDcHh500Fh34cGmb"
const TEST_KEY = "pk_test_51IT9oWG4OM4l9C1dre9yGOSSd1MtmDOWcGsjlv7Exe6u46E2UpIjt92w9zO7ld2i0v1os1NaYwWX48MxqbhvRoq8009WuwQftX"
const promise = loadStripe(TEST_KEY);

function getSteps(user) {
  if(user === undefined){
    return ['Review Booking', 'Customer Information' ,'Payment Information'];
  }
  else{
    return ['Review Booking', 'Payment Information'];
  }
}

function getStepContent(stepIndex: number, setCustomerPaid, setCID, businessName, appointmentDateTime, employeeName, service, user, handleNext, appt) {
  if(user === undefined){
    switch (stepIndex) {
      case 0:
        return <ConfirmationCard businessName={businessName} appointmentDateTime={appointmentDateTime} employeeName={employeeName} service={service}/>;
      case 1:
        return <GuestContactCard this={appt}/>;
      case 2:
        return <StripePaymentSetup paymentSuccess={setCustomerPaid} setToken={setCID}/>;
      case 3:
        return <BookingConfirmation businessName={businessName} appointmentDateTime={appointmentDateTime} employeeName={employeeName} service={service} />;
      default:
        return 'Our apologies, there has been a mishap with the booking process. Please try again later.';
    }
  }
  else{
    switch (stepIndex) {
      case 0:
        return <ConfirmationCard businessName={businessName} appointmentDateTime={appointmentDateTime} employeeName={employeeName} service={service}/>;
      case 1:
        return <StripePaymentSetup paymentSuccess={setCustomerPaid} setToken={setCID}/>;
      case 2:
        return <BookingConfirmation businessName={businessName} appointmentDateTime={appointmentDateTime} employeeName={employeeName} service={service} />;
      default:
        return 'Our apologies, there has been a mishap with the booking process. Please try again later.';
    }
  }
}

function StripePaymentSetup(props) {
  const price:number = props.price;
  return (
    <div className="App">
      <Elements stripe={promise}>
        <CheckoutForm paymentSuccess={props.paymentSuccess}  businessName={props.businessName} setToken={props.setToken}/>
      </Elements>
    </div>
  );
}

const ConfirmationCard = (props: any) => {
  // tslint:disable-next-line: no-shadowed-variable
  const classes = useStyles();

  return (
    <div>
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
    </div>
  );
}

//Guest Contact Card
const GuestContactCard = (props: any) => {
  // tslint:disable-next-line: no-shadowed-variable
  const classes = useStyles();

  return (
    <div>
      <div style={{textAlign: 'center'}}>
        <Typography align="center" variant="caption">
          Please provide your name and phone number in the fields below
        </Typography>
      <div style={{display: 'flex',}}>
      <TextField
                    name="name"
                    label="Name"
                    fullWidth={true}
                    variant="outlined"
                    value={props.this.state.customerName}
                    onChange={(e) => props.this.handleGuestName(e)}
                  />
        
        <TextField
                    name="phone"
                    type="number"
                    label="Phone Number"
                    fullWidth={true}
                    variant="outlined"
                    value={props.this.state.customerNumber}
                    onChange={(e) => props.this.handleGuestNumber(e)}
                  />
      </div>
      <div className={classes.confirmationBusinessName}>
          <div>or</div>
      </div>

      <Card>
        <CardContent>
          <Typography align="center" variant="body1">
            Create an account with ReZerve!
          </Typography>

          <Typography align="left" variant="caption">
          <p>With an account, you can:</p>
          <ul style={{marginLeft: '40px'}}>
              <li>Add Customer Reviews</li>
              <li>Send Direct Messages to your Stylist</li>
              <li>View your Past Appointments</li>
              <li>Bypass this section every time you book</li>
          </ul>
          Signing up with ReZerve is easy and free. Join our family and connect with your stylist today!
          </Typography>
        </CardContent>
          <CardActions >
              <div style={{display: 'flex', margin: 'auto'}}>
                <LoginDefault/>
                <SignUpPage/>
              </div>
          </CardActions>
      </Card>
      </div>

      
      
    </div>
  );
}

const BookingConfirmation = (props: any) => {
  return (
    <div>
      <ConfirmationCard businessName={props.businessName} appointmentDateTime={props.appointmentDateTime} employeeName={props.employeeName} service={props.service} phoneField={false} />
    </div>
  );
}

const CustomerCheckout = (props: any) => {
  // tslint:disable-next-line: no-shadowed-variableF
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps(props.user);
  const [customerPaid, setCustomerPaid] = React.useState<boolean>(false);
  const [cID, setCID] = React.useState<string>('Customer Token 0');
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

  const logToken = () => {
    console.log(cID)
  };

  const handleConfirm = () => {
    props.bookAppointment(cID);
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
            {getStepContent(activeStep, setCustomerPaid, setCID, props.businessName, props.appointmentDateTime, props.employeeName, props.service, props.user, handleNext, props.this)}
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
              disabled={(activeStep === steps.length - 1 ) ? !customerPaid : false || (activeStep !== 0 && !props.this.checkGuest())}
              onClick={
                activeStep === steps.length  ? handleConfirm : handleNext
              }
            >
              {activeStep === steps.length -1 ? 'Review Appointment' : activeStep === steps.length ? 'Confirm & Book' : 'Next'}
            </Button>
  
            {/* {activeStep !== steps.length - 1 &&
            <Button
            variant="contained"
            color="primary"
            disabled={(activeStep !== 0 && !props.this.checkGuest())}
            onClick={
              handleNext
            }
          >
            Next
          </Button>} */}
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
