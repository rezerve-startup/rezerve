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
  CardActions
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Close } from '@material-ui/icons';
import { Email, Visibility, VisibilityOff } from '@material-ui/icons';

import { connect } from 'react-redux';
import { auth, firestore } from '../../config/FirebaseConfig';
import {
  setUserEmployeeInfo,
  setUserCustomerInfo, 
  setBusinessAvailability
} from '../store/actions';
import { StoreState } from '../../shared/store/types';
import Reset from './reset';
import { Redirect } from 'react-router';
import firebase from 'firebase';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
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
    showPassword: false,
    loading: false,
    enable: true,
    retrieved: true,
    count: 0,
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

  const dispatchUpdateUser = () => {
    props.setUserCustomerInfo();
    props.setUserEmployeeInfo();
    props.setBusinessAvailability(); 
  }

  const handleSubmit = (event) => {
    auth.signOut();
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        auth
          .signInWithEmailAndPassword( values.email, values.password)
          .then((userCredential) => {
            if (userCredential !== null && userCredential.user) {
              setValues({ ...values, retrieved: true, count: 0});
            }
          })
          .catch(() => {
            setValues({ ...values, retrieved: false, count: (values.count + 1)});
          });
        })
    setValues({ ...values, loading: true, enable: false});
      event.preventDefault();
  }

  return (
    <div>
      <Button className={classes.loginButton} variant="contained" onClick={handleClickOpen} color="primary">
        Log In
      </Button>
      <Dialog open={open} fullScreen={true} disableBackdropClick={true}>
        <Container className={classes.root} maxWidth={false}>
          <IconButton color="primary" onClick={handleClose}>
            <Close />
          </IconButton>
          <Grid container alignItems="center" direction="column" spacing={5}>
            <Grid item>
                <Card className={classes.card} elevation={0}>
                    <form onSubmit={handleSubmit} autoComplete="off">
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
                                User account not found
                            </Typography>
                            <Grid container={true} spacing={1}>
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
                                <Grid item={true} xs={8}>
                                </Grid>
                            </Grid>
                        </CardActions>
                    </form>
                </Card>
                <Typography
                  //className={classes.signUpText}
                  variant="body2"
                  color="textSecondary"
                  align="center"
                  hidden={values.count < 3}
                  > 
                    <Reset/>
                </Typography>
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    </div>
  );
}

export default connect(mapStateToProps, { setUserEmployeeInfo, setUserCustomerInfo, setBusinessAvailability })(LoginDefault);
