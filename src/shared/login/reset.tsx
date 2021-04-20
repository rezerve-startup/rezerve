import React, {useState} from 'react';
import {
  Button,
  Container,
  Grid,
  createStyles,
  makeStyles,
  Theme,
  Dialog,
  IconButton,
  InputAdornment,
  Card,
  Typography,
  TextField,
  CardContent,
  CardActions,
  Snackbar,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Close } from '@material-ui/icons';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { connect } from 'react-redux';
import { auth, firestore } from '../../config/FirebaseConfig';
import { updateUser } from '../../shared/store/actions';
import { StoreState } from '../../shared/store/types';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      flex: '1'
    },
    card: {
        padding: '4px',
        overflow: 'auto',
    },
    title: {
        fontWeight: 'bold',
      },
  }),
);

function mapStateToProps(state: StoreState) {
    return {
      system: state.system,
    };
  }

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Reset(){
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    email: '',
    message: '',
    error: false,
    state: false
  });


  const handleClickOpen = (props) => {
    setOpen(true);
    setValues({ ...values, message: '', error: false , state: false });
  }

  
  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (field) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [field]: event.target.value });
    //console.log(values);
  };

  const handleSnackBarClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    if(values.error === false)
    {
      setOpen(false);
    }
    else{
      setValues({ ...values, state: false });
    }
    auth.signOut();
  };

  const handleInstructionSubmit = (event) => {
    auth
      .sendPasswordResetEmail(values.email)
      .then(()=>{
        setValues({ ...values, message: 'Instructions sent to email address ' + values.email, 
        error: false , state: true });
      })
      .catch(()=> {
        setValues({ ...values, message: 'Email Address not registered', error: true , state: true });
        //alert(JSON.stringify(values));
      });

      event.preventDefault();
  }

  return (
    <div>
      <Button variant="text" onClick={handleClickOpen} color="primary" >
      Forgot password?
      </Button>
      <Dialog open={open} fullScreen={true} disableBackdropClick={true}>
        <Container className={classes.root} maxWidth={false}>
          <IconButton color="primary" onClick={handleClose}>
            <Close />
          </IconButton>
          <Grid container alignItems="center" direction="column" spacing={5}>
            <Grid item>
                <Card className={classes.card} elevation={0}>
                    <form onSubmit={handleInstructionSubmit} autoComplete="off">
                        <CardContent>
                            <Typography
                                className={classes.title}
                                variant="h4"
                                component="h4"
                                align="center"
                                gutterBottom={true}
                            >
                                FORGOT PASSWORD?
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                component="p"
                                align="center"
                            >
                                Enter the email used to create your Reserve account and
                                 we will send you instructions to reset your password
                            </Typography>
                            <Grid container={true} spacing={1}>
                                <Grid item={true} xs={12}>
                                    <TextField
                                        name="Email"
                                        label="Email Address"
                                        type="email"
                                        fullWidth={true}
                                        required={true}
                                        variant="filled"
                                        onChange={handleChange('email')}
                                    />
                                </Grid>
                            </Grid>
                            </CardContent>
                            <CardActions style={{ justifyContent: 'center' }}>
                            <Grid container={true} spacing={2} justify='space-around'>
                                <Grid item={true} xs={8}>
                                    <Button 
                                    variant="contained" 
                                    color="primary"
                                    type="submit"
                                    fullWidth={true}
                                    >
                                        Send Instructions
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardActions >
                    </form>
                </Card>
                <Snackbar open={values.state} autoHideDuration={6000} onClose={handleSnackBarClose}>
                  <Alert onClose={handleSnackBarClose} severity={values.error ? "error" : "success"}>
                    {values.message}
                  </Alert>
                </Snackbar>
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    </div>
  );
}

export default connect(mapStateToProps, { updateUser })(Reset);
