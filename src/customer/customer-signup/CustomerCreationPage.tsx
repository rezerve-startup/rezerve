import React from 'react';
import {
  Button,
  Theme,
  createStyles,
  TextField,
  Card,
  withStyles,
  Grid,
  CardContent,
  Typography,
  CardActions,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@material-ui/core';
import { SignUpState } from '../../shared/store/types';
import { createNewCustomer } from '../../shared/store/actions';
import { connect } from 'react-redux';
import { auth, firestore } from '../../config/FirebaseConfig';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js'

interface Errors {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

type State = {
  loading: boolean;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  showPassword: boolean;
  validForm: boolean;
  errors: Errors;
} & SignUpState;

function mapStateToProps(state: State) {
  return {
    newUser: state.newUser,
  };
}

class CustomerCreationPage extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      validForm: false,
      email: 'testuser@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '501-888-8888',
      password: 'password',
      showPassword: false,
      newUser: props.newUser,
      errors: {
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleShowPassword = this.toggleShowPassword.bind(this);
    this.createNewCustomer = this.createNewCustomer.bind(this);
  }

  componentDidMount() {
    this.validateForm(this.state.errors)
  }

  validateEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePhone(phone: string): boolean {
    const phoneNumber = parsePhoneNumber(phone)
    return phoneNumber.isValid()
  }

  validateForm = (errors: Errors) => {
    let valid = true;
    Object.values(errors).forEach(
      (val: string) => val.length > 0 && (valid = false),
    );

    if (
      this.state.email === '' ||
      this.state.password === '' ||
      this.state.firstName === '' ||
      this.state.lastName === ''
    ) {
      valid = false;
    }

    return valid;
  };

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { name, value } = event.target;

    const errors = this.state.errors;

    switch (name) {
      case 'email':
        errors.email = this.validateEmail(value) ? '' : 'Email is not valid';
        break;
      case 'password':
        errors.password =
          value.length < 8 ? 'Password must be 8 characters long.' : '';
        break;
      case 'phone':
        const num = new AsYouType('US')
        num.input(value)
        errors.phone = (num.isValid()) ? '' : 'Phone number is not valid';
        break;
      default:
        break;
    }

    const validForm = this.validateForm(errors);
    this.setState({ ...this.state, validForm, errors, [name]: value });
  }

  handleSubmit(
    event: React.FormEvent<HTMLButtonElement> &
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      this.createNewCustomer();
    } else {
      console.log('Invalid form');
    }
  };

  toggleShowPassword(event: React.MouseEvent<HTMLButtonElement>) {
    this.setState({ ...this.state, showPassword: !this.state.showPassword })
  }

  dispatchCreateCustomer = (newCustomerId: string) => (newCustomer: any) => {
    this.props.createNewCustomer(newCustomerId, newCustomer);
  };

  createNewCustomer() {
    this.setState({ ...this.state, loading: true })
    console.log('Creating new customer...');
    
    const errors = this.state.errors

    auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        console.log("Signup successful...adding user to DB")
        
        const customerData = {
          appointments: [],
          reviews: []
        }

        firestore.collection('customers')
          .add(customerData)
          .then((docRef) => {
            const newUser = {
              customerId: docRef.id,
              email: this.state.email,
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              phone: this.state.phone,
              employeeId: ''
            }

            firestore.collection('users')
              .add(newUser)
              .then(() => {
                console.log(`Created new user with id: ${docRef.id}`)
              })
              .catch((e) => {
                console.log(e)
              })
          })
          .catch((e) => {
            console.log(e)
          })
      })
      .catch((err) => {
        switch(err.code) {
          case 'auth/email-already-in-use':
            errors.email = 'This email is already in use.'
            break
          case 'auth/invalid-email':
            errors.email = 'This email is invalid.'
            break
          case 'auth/weak-password':
            errors.password = 'This password is too weak.'
            break
          default:
            break
        }
        
        this.setState({ ...this.state, validForm: false, errors })
      })
      .finally(() => {
        this.setState({ ...this.state, loading: false })
      })
  }

  render() {
    const { classes } = this.props;
    const { errors, showPassword } = this.state;

    return (
      <div className={classes.root}>
        <Card className={classes.card} elevation={0}>
          <form
            className={classes.formRoot}
            onSubmit={this.handleSubmit}
            noValidate={true}
            autoComplete="off"
          >
            <CardContent>
              <Typography
                className={classes.title}
                gutterBottom={true}
                variant="overline"
                component="p"
              >
                Create Account
              </Typography>
              <Typography variant="caption" component="span">
                * means required
              </Typography>
              <Grid container={true} spacing={2}>
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
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={this.state.password}
                    fullWidth={true}
                    onChange={this.handleChange}
                    error={errors.password.length > 0}
                    helperText={errors.password}
                    required={true}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={this.toggleShowPassword} onMouseDown={this.toggleShowPassword}>
                            { showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item={true} xs={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    value={this.state.firstName}
                    fullWidth={true}
                    onChange={this.handleChange}
                    required={true}
                  />
                </Grid>
                <Grid item={true} xs={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    value={this.state.lastName}
                    fullWidth={true}
                    onChange={this.handleChange}
                    required={true}
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    name="phone"
                    label="Phone Number"
                    value={this.state.phone}
                    fullWidth={true}
                    onChange={this.handleChange}
                    error={errors.phone.length > 0}
                    helperText={errors.phone}
                  />
                </Grid>
              </Grid>

              <Grid
                container={true}
                spacing={1}
                className={classes.businessSection}
              >
                <Typography variant="body1" component="p">
                  Are you an employee?
                </Typography>
              </Grid>
            </CardContent>
            <CardActions style={{ justifyContent: 'center' }}>
              <AdornedButton
                className={classes.button}
                color="primary"
                variant="contained"
                type="submit"
                loading={this.state.loading}
                disabled={!this.state.validForm}
              >
                Create Account
              </AdornedButton>
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
      flex: 1,
    },
    formRoot: {
      flex: 1,
    },
    card: {
      padding: theme.spacing(1),
      height: '100vh',
    },
    title: {
      textAlign: 'center',
      fontSize: 28,
    },
    businessSection: {
      paddingTop: theme.spacing(12),
    },
    button: {
      maxWidth: '200px',
      margin: theme.spacing(2)
    },
    spinner: {
      marginLeft: theme.spacing(2)
    }
  });

const SpinnerAdornment = withStyles(styles, { withTheme: true })((props: any) => {
  const { classes } = props
  return (
    <CircularProgress className={classes.spinner} size={20} />
  )
})

const AdornedButton = (props) => {
  const {
    children,
    loading,
    ...rest
  } = props
  return (
    <Button {...rest}>
      {children}
      {loading && <SpinnerAdornment {...rest} />}
    </Button>
  )
}

export default connect(mapStateToProps, { createNewCustomer })(
  withStyles(styles, { withTheme: true })(CustomerCreationPage),
);
