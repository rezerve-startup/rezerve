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
  Divider,
  MobileStepper,
  colors
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
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@material-ui/icons';
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';
import { Alert } from '@material-ui/lab';
import { StoreState, SystemState } from '../../shared/store/types';
import { Business } from '../../types/Business'
import { User } from '../../types/User'
import BusinessRegisterLogin from './BusinessRegisterLogin';
import UserInfoForm from '../../shared/sign-up/UserInfoForm'
import BusinessInfoFrom from './BusinessInfoForm'


interface Errors {}

function mapStateToProps(state: StoreState) {
  return {
    system: state.system,
  };
}

interface ComponentState {
  open: boolean;
  loading: boolean;
  activeStep: number;
  validForm: boolean;
  creatingUserAccount: boolean;
  errors: Errors;
  snackbar: {
    open: boolean;
    message: string;
    type: 'error' | 'success' | undefined;
  };
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  description: string;
  coverImage: string;
};

type State = ComponentState & SystemState;

class BusinessSignUp extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      open: false,
      loading: false,
      activeStep: 0,
      validForm: false,
      creatingUserAccount: false,
      errors: {},
      snackbar: {
        open: false,
        message: '',
        type: undefined,
      },
      email: 'testuser@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '',
      password: 'password',
      name: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      description: '',
      coverImage: '',
      loggedIn: props.system.loggedIn,
      session: props.system.session,
      user: props.system.user,
      authChanging: props.system.authChanging,
      bookDialogStatus: props.system.bookDialogStatus
    };
  }

  updateValue = (name: string, value: string, valid: boolean) => {
    this.setState({ ...this.state, validForm: valid, [name]: value });
  };

  handleNext = () => { this.setState({ ...this.state, activeStep: this.state.activeStep + 1 })}

  handlePrev = () => { this.setState({ ...this.state, activeStep: this.state.activeStep - 1 })}

  handleSubmit(
    event: React.FormEvent<HTMLButtonElement> &
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (this.state.validForm) {
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
          className={classes.businessButton}
        >
          Business
        </Button>
        <Dialog open={this.state.open} fullScreen={true} disableBackdropClick={true}>
          <Card className={classes.card} elevation={0}>
            <CardContent style={{ padding: '4px' }}>
              <Fab
                className={classes.backFab}
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
                <div className={classes.root}>
                  <form
                    className={classes.root}
                    onSubmit={this.handleSubmit}
                    noValidate={true}
                    autoComplete="off"
                  >
                    {(this.state.activeStep === 0) ? (
                      <UserInfoForm
                        title="Personal Info"
                        email={this.state.email}
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        phone={this.state.phone}
                        password={this.state.password}
                        updateValue={this.updateValue}
                      />
                    ) : (this.state.activeStep === 1) ? (
                      <BusinessInfoFrom
                        title="Business Info"
                        name={this.state.name}
                        address={this.state.address}
                        city={this.state.city}
                        state={this.state.state}
                        zipcode={this.state.zipcode}
                        description={this.state.description}
                        coverImage={this.state.coverImage}
                        updateValue={this.updateValue}
                      />
                    ) : (
                      <Typography variant="subtitle1" component="p">Review</Typography>
                    )
                    }
                  </form>
                  <MobileStepper
                    variant="dots"
                    steps={3}
                    position="bottom"
                    activeStep={this.state.activeStep}
                    nextButton={
                      <Button size="small" variant="text" onClick={this.handleNext} disabled={!this.state.validForm || this.state.activeStep === 2} >
                        Continue
                        {<KeyboardArrowRight />}
                      </Button>
                    }
                    backButton={
                      <Button size="small" onClick={this.handlePrev} disabled={this.state.activeStep === 0}>
                        {<KeyboardArrowLeft />}
                        Back
                      </Button>
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </Dialog>
      </div>
    );
  }
}

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1
  },
  card: {
    padding: '4px',
    overflow: 'auto'
  },
  title: {
    textAlign: 'center',
    fontSize: 24
  },
  businessButton: {
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
