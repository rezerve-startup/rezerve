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
  CardMedia,
  InputAdornment,
  IconButton,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  ListItem,
  ListItemAvatar,
  List,
  Avatar,
  ListItemText,
  ListSubheader,
  Fab,
  Dialog,
  Snackbar,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { auth, firestore } from '../../config/FirebaseConfig';
import {
  Visibility,
  VisibilityOff,
  Image,
  ArrowBack,
  ArrowForward,
  Close,
} from '@material-ui/icons';
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';
import { Alert } from '@material-ui/lab';
import { StoreState, SystemState } from '../../shared/store/types';
import BusinessRegisterLogin from './BusinessRegisterLogin';


interface Errors {}

function mapStateToProps(state: StoreState) {
  return {
    system: state.system,
  };
}

interface ComponentState {
  open: boolean;
  loading: boolean;
  validForm: boolean;
  creatingUserAccount: boolean;
  errors: Errors;
  snackbar: {
    open: boolean;
    message: string;
    type: 'error' | 'success' | undefined;
  };
};

type State = ComponentState & SystemState;

class BusinessSignUp extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      open: false,
      loading: false,
      validForm: false,
      creatingUserAccount: false,
      errors: {},
      snackbar: {
        open: false,
        message: '',
        type: undefined,
      },
      loggedIn: props.system.loggedIn,
      session: props.system.session,
      user: props.system.user,
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.createNewCustomer = this.createNewCustomer.bind(this);
  }

  componentDidMount() {
    this.validateForm(this.state.errors);

    /* const businesses = this.state.businesses;

    firestore.collection('businesses').onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const business = doc.data();
        for (let index = 0; index < 10; index++) {
          businesses.push({
            name: business.name,
            location: `${business.about.city}, ${business.about.state}`,
            image: business.coverImage,
          });
        }
      });
    });

    this.setState({ ...this.state, businesses }); */
  }

 /*  validateEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePhone(phone: string): boolean {
    const phoneNumber = parsePhoneNumber(phone);
    return phoneNumber.isValid();
  }


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
        const num = new AsYouType('US');
        num.input(value);
        errors.phone = num.isValid() ? '' : 'Phone number is not valid';
        break;
      default:
        break;
    }

    const validForm = this.validateForm(errors);
    this.setState({ ...this.state, validForm, errors, [name]: value });
  } */
  validateForm = (errors: Errors) => {
    let valid = true;
    Object.values(errors).forEach(
      (val: string) => val.length > 0 && (valid = false),
    );

    return valid;
  }

  handleSubmit(
    event: React.FormEvent<HTMLButtonElement> &
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (this.validateForm(this.state.errors)) {
      console.log("Creating Business");
    } else {
      console.log('Invalid form');
    }
  }

  handleSignUp = () => {
    console.log("Signing up...")
    this.setState({ ...this.state, creatingUserAccount: true })
    // this.openDialog()
  }

  openDialog = () => {
    this.setState({ ...this.state, open: true });
  }

  closeDialog = () => {
    alert('Are you sure you want to cancel creating your account?');
    this.setState({ ...this.state, open: false });
  }

  /* dispatchCreateCustomer = (newCustomerId: string) => (newCustomer: any) => {
    this.props.createNewCustomer(newCustomerId, newCustomer);
  };

  createNewCustomer() {
    this.setState({ ...this.state, loading: true });
    const errors = this.state.errors;

    auth
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        const customerData = {
          appointments: [],
          reviews: [],
        };

        firestore
          .collection('customers')
          .add(customerData)
          .then((docRef) => {
            const newUser = {
              customerId: docRef.id,
              email: this.state.email,
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              phone: this.state.phone,
              employeeId: '',
            };

            firestore
              .collection('users')
              .add(newUser)
              .then(() => {
                console.log(`Created new user with id: ${docRef.id}`);
              })
              .catch((e) => {
                console.log(e);
              });
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((err) => {
        switch (err.code) {
          case 'auth/email-already-in-use':
            errors.email = 'This email is already in use.';
            break;
          case 'auth/invalid-email':
            errors.email = 'This email is invalid.';
            break;
          case 'auth/weak-password':
            errors.password = 'This password is too weak.';
            break;
          default:
            break;
        }

        this.setState({ ...this.state, validForm: false, errors });
      })
      .finally(() => {
        this.setState({
          ...this.state,
          loading: false,
          snackbar: {
            open: true,
            message: 'Successfully created your account',
            type: 'success',
          },
        });
      });
  } */

  render() {
    const { classes } = this.props;
    const { errors, snackbar, loggedIn, creatingUserAccount } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="h5" component="h5" className={classes.title}>
          Sign Up
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={this.openDialog}
          className={classes.customerButton}
        >
          Business
        </Button>
        <Dialog open={this.state.open} fullScreen={true} disableBackdropClick={true}>
          <Card className={classes.card} elevation={0}>
            <Fab
              color="primary"
              size="small"
              variant="extended"
            >
              <ArrowBack />
              &nbsp;Back
            </Fab>
            {(!loggedIn && !creatingUserAccount) ? (
              <BusinessRegisterLogin handleSignUp={this.handleSignUp} />
            ) : (
              <form
                className={classes.root}
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
                    Create User Account
                  </Typography>
                  <Typography
                    variant="caption"
                    component="p"
                    color="textSecondary"
                    align="center"
                  >
                    * means required
                  </Typography>
                </CardContent>
                <Typography
                  className={classes.title}
                  gutterBottom={true}
                  variant="overline"
                  component="p"
                >
                  Create Business Account
                </Typography>
              </form>
            )}
          </Card>
        </Dialog>
      </div>
    );
  }
}

const styles = (theme: Theme) => createStyles({
  root: {
    flex: 1,
  },
  card: {
    padding: '4px',
    height: '200vh',
    overflow: 'auto'
  },
  title: {
    textAlign: 'center',
    fontSize: '20'
  },
  customerButton: {
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
    paddingTop: theme.spacing(2),
  },
});

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(BusinessSignUp),
);
