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
} from '@material-ui/core/';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import classes from '*.module.css';
import './customer-checkout.css';
import { Close } from '@material-ui/icons';

function StripePaymentSetup() {
  const classes = useStyles();
  return (
    <div className={classes.itemCard}>
      <Divider className={classes.divider0} />
      <h1>
        <strong>Stripe Payment Setup</strong>
      </h1>
      <Divider className={classes.divider0} />
    </div>
  );
}

function ConfirmationCard() {
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
        <h3 className={classes.stat}>$35</h3>
      </div>

      <Divider className={classes.divider0} />
      <div className={classes.items}>
        <h3>
          <strong>Sat 1/16/2021</strong>
        </h3>
        <h3 className={classes.stat}>4:00pm</h3>
      </div>
    </div>
  );
}


function CustomerCheckout() {
  const theme = useTheme();
  const classes = useStyles();
  const fullscreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(false);

  const openOnClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={openOnClick}>Open Checkout</Button>
  
      <Dialog open={open} fullScreen={fullscreen} className={classes.receiptPage}>
        <DialogTitle>
          <Typography variant="h6" component="h6">Checkout</Typography>
          
          <Fab color="primary" onClick={handleClose}>
            <Close />
          </Fab>
        </DialogTitle>
        <DialogContent>
          {/* <div className={classes.itemPlus}>
            <h1>
              <strong>Confirm</strong>
            </h1>
          </div> */}
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

          <button className={classes.button}>Confirm & Book</button>
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
}));

export default CustomerCheckout;
