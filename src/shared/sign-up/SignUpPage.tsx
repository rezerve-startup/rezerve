import React from 'react';
import {
  Button,
  Container,
  Grid,
  createStyles,
  makeStyles,
  Theme,
  Dialog,
  IconButton,
  Typography,
  Card,
  CardContent,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

import BusinessSignUp from '../../business/business-signup/BusinessSignUp';
import CustomerSignUp from '../../customer/customer-signup/CustomerSignup';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      color: theme.palette.secondary.light,
      paddingTop: 15,
    },
    button: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.light,
      borderRadius: '30px',
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.primary.dark,
        boxShadow: 'none',
      },
    },
    signUpButton: {
      borderRadius: '30px',
      marginRight: '5px'
    },
    card: {
      [theme.breakpoints.down('md')]:{
        width: '80vw'
      },
      [theme.breakpoints.up('md')]:{
        width: '70vw'
      },
      [theme.breakpoints.up('lg')]:{
        width: '50vw'
      },
      padding: '4px',
      overflow: 'auto',
      borderRadius: '30px',
      border: '1px solid black',
    },
    title: {
      fontWeight: 'bold',
    },
    typo: {
      color: theme.palette.primary.main
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
              <Card className={classes.card} elevation={0}>
                <CardContent>
                  <Typography 
                  variant="h4" 
                  component="h4" 
                  align="center"
                  className={classes.title
                  }>
                    Sign Up
                  </Typography>
                  
                  <Grid container={true} spacing={1} style={{ marginTop: '24px' }} direction="column">
                    <Grid item>
                      <Typography
                        className={classes.typo}
                        variant="caption"
                        component="p"
                        color="textSecondary"
                        align="center"
                      >
                        * Employees signup as users
                    </Typography>
                    </Grid>
                    <Grid item>
                      <CustomerSignUp handleSignUpClose={handleClose} />
                    </Grid>
                    <Grid item>
                      <BusinessSignUp handleSignUpClose={handleClose} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    </div>
  );
}

export default SignUpPage;
