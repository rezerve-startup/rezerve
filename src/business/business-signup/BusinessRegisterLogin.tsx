import {
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Button,
  Grid,
  createStyles,
  Theme,
  Typography,
  withStyles,
  TextField,
  Tooltip,
} from '@material-ui/core';
import { Email, Visibility, VisibilityOff } from '@material-ui/icons';
import React from 'react';
import { connect } from 'react-redux';
import { auth, firestore } from '../../config/FirebaseConfig';
import { updateUser } from '../../shared/store/actions';
import { StoreState } from '../../shared/store/types';

function mapStateToProps(state: StoreState) {
  return {
    system: state.system,
  };
}

interface ComponentState {
  loading: boolean;
  validForm: boolean;
  email: string;
  password: string;
  showPassword: boolean;
  user: any;
  errors: {
    email: string;
    password: string;
  };
}

type State = ComponentState;

class BusinessRegisterLogin extends React.Component<any, State> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      validForm: false,
      email: '',
      password: '',
      showPassword: false,
      user: props.system.user,
      errors: {
        email: '',
        password: '',
      },
    };
  }

  validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  validateForm = async(errors: { email: string; password: string }) => {
    let valid = true;
    if (this.state.email !== '' || this.state.password !== '') {
      await new Promise((resolve) => setTimeout(resolve, 250))
      Object.values(errors).forEach(
        (val: string) => val.length > 0 && (valid = false),
      );
      this.setState({ ...this.state, validForm: valid })
    }
    return valid;
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;

    const errors = this.state.errors;

    if (value === '') {
      errors[name] = 'This field is required.'
    } else {
      switch (name) {
      case 'email':
        errors.email = this.validateEmail(value) ? '' : 'Email is not valid';
        break;
      case 'password':
        errors.password = ''
        break;
      default:
        break;
      }
    }
    this.validateForm(errors);
    this.setState({ ...this.state, errors, [name]: value });
  };

  dispatchUpdateUser = (newUser) => {
    this.props.updateUser(newUser);
  };

  signInUser = () => {
    auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCreds) => {
        if (userCreds !== null && userCreds.user) {
          const user = userCreds.user;

          firestore
            .collection('users')
            .doc(`${user.uid}`)
            .get()
            .then((userObj) => {
              const userInfo = userObj.data();
              this.dispatchUpdateUser(userInfo);
            });
        }
      })
      .catch((e) => {
        console.log(e)
      })
  };

  handleSignIn = () => {
    this.signInUser();
  };

  toggleShowPassword = () => {
    this.setState({ ...this.state, showPassword: !this.state.showPassword });
  };

  render() {
    const { classes } = this.props;
    const { errors } = this.state;

    return (
      <div className={classes.root}>
        <Card className={classes.card} elevation={0}>
          <form onSubmit={this.handleSignIn} autoComplete="off" >
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
                color="textSecondary"
                component="p"
                align="center"
              >
                To create a business, you must first log in or create a user
                account
              </Typography>
              <Grid container={true} spacing={1} style={{ marginTop: '24px' }}>
                <Grid item={true} xs={12}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={this.state.email}
                    fullWidth={true}
                    onChange={this.handleChange}
                    error={errors.email.length > 0}
                    helperText={errors.email}
                    required={true}
                    variant="filled"
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    name="password"
                    label="Password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.password}
                    fullWidth={true}
                    onChange={this.handleChange}
                    error={errors.password.length > 0}
                    helperText={errors.password}
                    required={true}
                    variant="filled"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip
                            title={
                              this.state.showPassword
                                ? 'Hide Password'
                                : 'Show Password'
                            }
                            arrow
                          >
                            <IconButton onClick={this.toggleShowPassword}>
                              {this.state.showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions style={{ justifyContent: 'center' }}>
              <Grid container={true} spacing={2} justify='space-around'>
                <Grid item={true} xs={8}>
                  <AdornedButton
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    type="submit"
                    fullWidth={true}
                    loading={this.state.loading}
                    disabled={!this.state.validForm}
                  >
                    Log In
                  </AdornedButton>
                </Grid>
                <Grid item={true} xs={12}>
                  <Typography
                    className={classes.signUpText}
                    variant="body2"
                    color="textSecondary"
                    align="center"
                  >
                    New to ReZerve?
                    <Button variant="text" color="primary" onClick={this.props.handleSignUp}>Sign Up</Button>
                  </Typography>
                </Grid>
              </Grid>
            </CardActions>
          </form>
        </Card>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flex: '1',
    },
    card: {
      padding: '4px',
      overflow: 'auto',
    },
    title: {
      fontWeight: 'bold',
    },
    spinner: {
      marginLeft: theme.spacing(2),
    },
    signUpText: {
      
    }
  });

const SpinnerAdornment = withStyles(styles, { withTheme: true })(
  (props: any) => {
    const { classes } = props;
    return <CircularProgress className={classes.spinner} size={20} />;
  },
);

const AdornedButton = (props) => {
  const { children, loading, ...rest } = props;
  return (
    <Button {...rest}>
      {children}
      {loading && <SpinnerAdornment {...rest} />}
    </Button>
  );
};

export default connect(mapStateToProps, { updateUser })(
  withStyles(styles, { withTheme: true })(BusinessRegisterLogin),
);
