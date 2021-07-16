import {
  Button, Card, CardActions, CardContent, Container, createStyles, Dialog, Grid, IconButton,
  InputAdornment, makeStyles, Snackbar, TextField, Theme, Typography
} from '@material-ui/core';
import { Close, Visibility, VisibilityOff } from '@material-ui/icons';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import firebase from 'firebase';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { auth } from '../../config/FirebaseConfig';
import { StoreState } from '../../shared/store/types';
import SignUpPage from '../sign-up/SignUpPageForLoginPage';
import {
  setBusinessAvailability, setUserCustomerInfo, setUserEmployeeInfo
} from '../store/actions';
import Reset from './reset';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: 'white',
      minHeight: '100vh',
      flex: '1'
    },
    loginButton: {
        borderRadius: '30px',
        marginRight: '5px',
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.light,
        border: '1px solid white',
        '&:hover': {
          backgroundColor: theme.palette.secondary.dark,
          color: theme.palette.secondary.light,
        },
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
      backgroundColor: 'white',
      padding: '4px',
      overflow: 'auto',
      borderRadius: '25px' 
    },
    formStyle: {
      backgroundColor: 'white'
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

function LoginDefault(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const [values, setValues] = useState({
    email: '',
    password: '',
    message: '',
    showPassword: false,
    loading: false,
    enable: true,
    retrieved: true,
    eCode: '',
    error: false,
    state: false
  });

  const handleChange = (field) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [field]: event.target.value });
    //console.log(JSON.stringify(values));
    //console.log(values);
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        auth
          .signInWithEmailAndPassword( values.email, values.password)
          .then((userCredential) => {
            if (userCredential !== null && userCredential.user) {
              setValues({ ...values, retrieved: true, eCode: '', 
                message: 'Login Successful ', 
                error: false , state: true
              });
            }
          })
          .catch((e) => {
            setValues({ ...values, retrieved: false, eCode: e.code,
              message: 'The Email or Password entered is invalid. Please try again.', 
              error: true , state: true
            });
          });
        })
    setValues({ ...values, loading: true, enable: false});
      event.preventDefault();
  }

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
  };

  return (
    <div>
      <Button className={classes.loginButton} variant="contained" onClick={handleClickOpen} color="primary">
        Log In
      </Button>
      <Dialog open={open} fullScreen={true} disableBackdropClick={true}>
        <Container className={classes.root} maxWidth={false}>
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <IconButton color="primary" onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container alignItems="center" direction="column" spacing={5}>
            <Grid item>
                <Card className={classes.card} elevation={0}>
                    <form onSubmit={handleSubmit} className={classes.formStyle} autoComplete="off">
                        <CardContent>
                            <Typography
                                className={classes.title}
                                variant="h4"
                                component="h4"
                                align="center"
                                gutterBottom={true}
                            >
                                LOG IN
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="error"
                                component="p"
                                align="center"
                                hidden={values.retrieved}
                            >
                                The Email or Password entered is invalid.
                            </Typography>
                            <Grid container={true} spacing={1} style={{ marginTop: '24px' }}>
                                <Grid item={true} xs={12}>
                                    <TextField
                                        name="email"
                                        label="Email"
                                        type="email"
                                        onChange={handleChange('email')}
                                        fullWidth={true}
                                        required={true}
                                        variant="filled"
                                    />
                                </Grid>
                                <Grid item={true} xs={12}>
                                    <TextField
                                        name="password"
                                        label="Password"
                                        fullWidth={true}
                                        type={values.showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        required={true}
                                        variant="filled"
                                        onChange={handleChange('password')}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    >
                                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                </Grid>
                            </CardContent >
                            <CardActions style={{ justifyContent: 'center' }}>
                            <Grid container={true} spacing={2} justify='space-around'>
                                <Grid item={true} xs={8}>
                                    <Button 
                                    variant="contained" 
                                    color="primary"
                                    type="submit"
                                    fullWidth={true}
                                    >
                                        Log In
                                    </Button>
                                </Grid>
                            
                              <Grid item={true} xs={12}>
                                <Typography
                                  //className={classes.signUpText}
                                  variant="body2"
                                  color="textSecondary"
                                  align="center"
                                >
                                  <Grid container justify='center' alignContent='center'>
                                    <Grid item>
                                      New to ReZerve?
                                    </Grid>
                                    <Grid item>
                                      <SignUpPage />
                                    </Grid>
                                  </Grid>
                                </Typography>
                              </Grid>
                            </Grid>
                        </CardActions>
                    </form>
                </Card>
                <Typography
                  //className={classes.signUpText}
                  variant="body2"
                  color="secondary"
                  align="center"
                  hidden={!(values.eCode === "auth/too-many-requests") 
                  && !(values.eCode === "auth/wrong-password")
                  && !(values.eCode === "auth/user-not-found")
                }
                  > 
                    <Reset/>
                </Typography>
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

export default connect(mapStateToProps, { setUserEmployeeInfo, setUserCustomerInfo, setBusinessAvailability })(LoginDefault);
