import React from 'react';
import {
  Button,
  Container,
  Grid,
  createStyles,
  makeStyles,
  Theme,
  Dialog,
  Fab,
  IconButton,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Close } from '@material-ui/icons';

import BusinessSignUp from '../../business/business-signup/BusinessSignUp';
import CustomerSignUp from '../../customer/customer-signup/CustomerSignup';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.secondary.dark,
      minHeight: '100vh',
      color: theme.palette.secondary.light,
      paddingTop: 15,
    },
    button: {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.primary.light,
      borderRadius: '0',
      boxShadow: 'none',
      borderBottom: '1px solid white',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.primary.dark,
        boxShadow: 'none',
      },
    },
    signUpButton: {
      borderRadius: '30px',
      marginRight: '5px'
    }
  }),
);

function SignUpPage() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button className={classes.signUpButton} variant="contained" onClick={handleClickOpen} color="primary">
        Sign Up
      </Button>
      <Dialog open={open} fullScreen={true} disableBackdropClick={true}>
        <Container className={classes.root} maxWidth={false}>
          <IconButton color="primary" onClick={handleClose}>
            <Close />
          </IconButton>
          <Grid container alignItems="center" direction="column" spacing={5}>
            <Grid item>
              <CustomerSignUp />
            </Grid>
            <Grid item>
              <BusinessSignUp />
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    </div>
  );
}

export default SignUpPage;
