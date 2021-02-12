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
  Typography,
  Fab,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel
} from '@material-ui/core/';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import classes from '*.module.css';
import { Close } from '@material-ui/icons';


function BusinessHeader() {
  const classes = useStyles();
  return (
    <div className={classes.itemCard}>
      <Divider className={classes.divider0} />
      <h1>
        <strong>Business Header</strong>
      </h1>
      <Divider className={classes.divider0} />
    </div>
  );
}

function SwipableDivs(){
  const classes = useStyles();
  return (
    <div className={classes.itemCard}>
      <Divider className={classes.divider0} />
      <h1>
        <strong>Swipable Divs</strong>
      </h1>
      <Divider className={classes.divider0} />
    </div>
  );
}

function AppointmentsDiv() {
  const classes = useStyles();


  return (
    <div className={classes.itemCard}>
      <Divider className={classes.divider0} />
      <h1>
        <strong>Upcoming Appointments</strong>
      </h1>
      </div>
  );
}

function BookingConfirmation(){
  const classes = useStyles();
  return(
    <div>
      <ConfirmationCard/>
      <PaymentInfo/>
      
      <div className={classes.itemPlus1}>
            <h3>
              <strong>Receive Text Reminders/Updates</strong>
            </h3>
            <Checkbox className={classes.checkbox} />
          </div>

          <div className={classes.phoneField}>
            <TextField type="tel" placeholder="Phone Number" />
          </div>
    </div>
)  
}

function BusinessProfile() {
  const theme = useTheme();
  const classes = useStyles();
  const fullscreen = useMediaQuery(theme.breakpoints.down('lg'));
  const [open, setOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

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
    setOpen(true)
    handleReset()
  }

  const handleClose = () => {
    setOpen(false)
  }

var backFunction = () => handleBack;

  return (
    <div>
      <Button variant="contained" color="primary" onClick={openOnClick}>Open Checkout</Button>
      <Dialog open={open} fullScreen={fullscreen} className={classes.receiptPage}>
        <DialogContent>
          {/* <div className={classes.itemPlus}>
            <h1>
              <strong>Confirm</strong>
            </h1>
          </div> 
          <ConfirmationCard />

          <div className={classes.itemPlus1}>
            <h2>
              <strong>Deposit/Booking Fee</strong>
            </h2>
          </div>
          <StripePaymentSetup />

          <div className={classes.itemPlus1}>
            <h3>
              <strong>Receive Text Reminders/Updates</strong>
            </h3>
            <Checkbox className={classes.checkbox} />
          </div>

          <div className={classes.phoneField}>
            <TextField type="tel" placeholder="Phone Number" />
          </div>

        <button className={classes.button}>Confirm & Book</button*/}


<div>

        <BusinessHeader/>
        <SwipableDivs/>
        <AppointmentsDiv/>
        
      </div>
        </DialogContent>
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
    right: '60px',
    fontWeight: 'bold',
    position: 'absolute',
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
    right: '60px',
    fontWeight: 'bold',
    position: 'absolute',
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

export default BusinessProfile;
