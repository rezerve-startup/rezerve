import React from 'react';
import {
  Button,
  Theme,
  createStyles,
  Card,
  withStyles,
  CardContent,
  Typography,
  CardActions,
  CircularProgress,
  Fab,
  Dialog,
  MobileStepper,
  CardHeader,
  CardMedia,
} from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  auth,
  firestore,
  unsubscribe,
  storageRef,
} from '../../config/FirebaseConfig';
import {
  ArrowBack,
  ArrowForward,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@material-ui/icons';
import Geocode from 'react-geocode';
import firebase from 'firebase';
import {
  updateUser,
  createNewBusiness,
  setAuthChanging,
  setCreatingUser,
  logoutUser,
} from '../../shared/store/actions';
import { useHistory } from 'react-router-dom';
import { StoreState, SystemState } from '../../shared/store/types';
import BusinessRegisterLogin from './BusinessRegisterLogin';
import UserInfoForm from '../../shared/sign-up/UserInfoForm';
import BusinessInfoFrom from './BusinessInfoForm';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
Geocode.setLanguage('en');
Geocode.setLocationType('ROOFTOP');

function mapStateToProps(state: StoreState) {
  return {
    system: state.system,
  };
}

/* function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateUser, createNewBusiness, setAuthChanging, setCreatingUser, logoutUser }, dispatch)
} */
const actionCreators = {
  setAuthChanging,
  setCreatingUser,
  updateUser,
  logoutUser,
  createNewBusiness,
};

interface ComponentState {
  open: boolean;
  loading: boolean;
  activeStep: number;
  validForm: boolean;
  creatingUserAccount: boolean;
  userUID: string;
  employeeId: string;
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
  coverImagePath: string;
}

type State = ComponentState & SystemState;

class BusinessSignUp extends React.Component<any, State> {
  _isMounted = false;
  unsubscribe2: any = undefined;

  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      loading: false,
      activeStep: 0,
      validForm: false,
      creatingUserAccount: false,
      userUID: '',
      employeeId: '',
      email: 'testimage@test.com',
      firstName: 'Test',
      lastName: 'Image',
      phone: '',
      password: 'testimage',
      name: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      description: '',
      coverImage: '',
      coverImagePath: '',
      loggedIn: props.system.loggedIn,
      session: props.system.session,
      user: props.system.user,
      authChanging: props.system.authChanging,
      creatingUser: props.system.creatingUser,
      bookDialogStatus: props.system.bookDialogStatus,
    };

    this.signInUser = this.signInUser.bind(this);
    this.createNewUser = this.createNewUser.bind(this);
    this.dispatchUpdateUser = this.dispatchUpdateUser.bind(this);
    this.dispatchSetCreatingUser = this.dispatchSetCreatingUser.bind(this);
    this.createNewBusiness = this.createNewBusiness.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this.props.setCreatingUser(false)
    this._isMounted = false;
  }

  dispatchUpdateUser(newUser) {
    this.props.updateUser(newUser);
  }

  dispatchSetCreatingUser(value: boolean) {
    this.props.setCreatingUser(value);
  }

  signInUser(email: string, password: string) {
    console.log(this.props.system.creatingUser);

    this.props.setCreatingUser(true).then(() => {
      console.log(this.props.system.creatingUser);
      auth
        .signInWithEmailAndPassword(email, password)
        .then((userCreds) => {
          if (userCreds !== null && userCreds.user) {
            const user = userCreds.user;

            firestore
              .collection('users')
              .doc(user.uid)
              .get()
              .then((snapshot) => {
                const userObj = snapshot.data();
                this.setState({
                  ...this.state,
                  loggedIn: true,
                  activeStep: 0,
                  userUID: user.uid,
                  email: userObj?.email,
                  firstName: userObj?.firstName,
                  lastName: userObj?.lastName,
                  phone: userObj?.phone,
                  password,
                });
              });
          } else {
            this.setState({ ...this.state, loggedIn: false, activeStep: 0 });
          }
        })
        .catch((e) => {
          console.log(e);
        })
    });
  }

  updateValue = (name: string, value: string | string[], valid: boolean) => {
    this.setState({ ...this.state, validForm: valid, [name]: value });
  };

  handleNext = () => {
    this.setState({ ...this.state, activeStep: this.state.activeStep + 1 });
  };

  handlePrev = () => {
    this.setState({ ...this.state, activeStep: this.state.activeStep - 1 });
  };

  handleSubmit = (
    event: React.FormEvent<HTMLButtonElement> &
      React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (this.state.validForm) {
      this.createNewBusiness();
    } else {
      console.log('Invalid form');
    }
  };

  handleSignUp = () => {
    this.setState({ ...this.state, creatingUserAccount: true });
  };

  openDialog = () => {
    this.setState({ ...this.state, open: true });
  };

  closeDialog = () => {
    alert('Are you sure you want to cancel creating your account?');
    this.setState({ ...this.state, open: false, creatingUserAccount: false });
  };

  async createNewUser(email: string, password: string) {
    if (this.state.creatingUserAccount) {
      try {
        const result = await auth.createUserWithEmailAndPassword(
          email,
          password,
        );
        return result.user?.uid;
      } catch (e) {
        console.log(e);
        throw e;
      }
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(this.state.userUID);
        }, 1000);
      });
    }
  }

  async createNewBusiness() {
    const email = this.state.email;
    const password = this.state.password;
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const phone = this.state.phone;
    const businessName = this.state.name;
    const businessDescription = this.state.description;
    const businessAddress = this.state.address;
    const businessCity = this.state.city;
    const businessState = this.state.state;
    const businessZipcode = this.state.zipcode;
    const address = `${this.state.address}, ${this.state.city}, ${this.state.state}, ${this.state.zipcode}`;

    this.setState({ ...this.state, loading: true });
    await Geocode.fromAddress(address)
      .then((res) => {
        const { lat, lng } = res.results[0].geometry.location;
        const loc = new firebase.firestore.GeoPoint(lat, lng);

        this.createNewUser(email, password).then((userUID) => {
          const newEmployeeData = {
            businessId: '',
            position: 'Stylist',
            isOwner: true,
            todos: [],
            clients: [],
            appointments: [],
            availability: [
              { day: 'Monday', start: '08:00', end: '17:00' },
              { day: 'Tuesday', start: '08:00', end: '17:00' },
              { day: 'Wednesday', start: '08:00', end: '17:00' },
              { day: 'Thursday', start: '08:00', end: '17:00' },
              { day: 'Friday', start: '08:00', end: '17:00' },
            ],
          };
          const empRef = firestore.collection('employees').doc();
          const userRef = firestore.collection('users').doc(`${userUID}`);

          firestore
            .runTransaction((transaction) => {
              return transaction.get(empRef).then((empDocRef) => {
                const newUserData = {
                  employeeId: empDocRef.id,
                  email,
                  firstName,
                  lastName,
                  phone,
                  customerId: '',
                };

                transaction.set(empRef, newEmployeeData);
                transaction.set(userRef, newUserData);
                return empDocRef.id;
              });
            })
            .then((employeeId) => {
              const newBusinessData = {
                name: businessName,
                numWorkers: 1,
                description: businessDescription,
                about: {
                  address: businessAddress,
                  city: businessCity,
                  state: businessState,
                  zipcode: businessZipcode,
                  daysOpen: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                  ],
                  closingTime: '17:00',
                  openingTime: '8:00',
                  location: loc,
                },
                coverImage: '',
                employees: [`${employeeId}`],
                employeeRequests: [],
                reviews: [],
                perfomance: [],
                appointments: [],
                overallRating: 0,
              };

              firestore
                .collection('businesses')
                .add(newBusinessData)
                .then((docRef) => {
                  const path = `BusinessCoverImages/${docRef.id}/image`;
                  const imageRef = storageRef.child(path);

                  imageRef
                    .putString(this.state.coverImage, 'data_url')
                    .then((snapshot) => {
                      docRef.update({ coverImage: path });
                    });

                  firestore
                    .collection('employees')
                    .doc(employeeId)
                    .update({
                      businessId: docRef.id,
                    })
                    .then(() => {
                      this.props.setCreatingUser(false).then(() => {
                        auth.signOut().then(() => {
                          auth
                            .signInWithEmailAndPassword(email, password)
                            .then((userCreds) => {
                              if (userCreds !== null && userCreds.user) {
                                const user = userCreds.user;
                                this.dispatchUpdateUser(user);
                              }
                              this.props.handleSignUpClose();
                              this.setState({
                                ...this.state,
                                open: false,
                                loading: false,
                              });
                            });
                        });
                      })
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
                .catch((e) => {
                  console.log(e);
                });
            });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { classes } = this.props;
    const { loggedIn, creatingUserAccount } = this.state;

    return (
      <div className={classes.root}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForward />}
          onClick={this.openDialog}
          className={classes.businessButton}
          fullWidth={true}
        >
          Business
        </Button>
        <Dialog
          open={this.state.open}
          fullScreen={true}
          disableBackdropClick={true}
        >
          <Card className={classes.card} elevation={0}>
            <CardContent
              style={{ padding: '4px', borderRadius: '0px', boxShadow: '0px' }}
            >
              <Fab
                className={classes.backFab}
                color="primary"
                size="small"
                variant="extended"
                onClick={this.closeDialog}
              >
                <ArrowBack />
                &nbsp;Back
              </Fab>
              {!loggedIn && !creatingUserAccount ? (
                <BusinessRegisterLogin
                  handleSignUp={this.handleSignUp}
                  handleSignIn={this.signInUser}
                />
              ) : (
                <div className={classes.root}>
                  <form
                    className={classes.form}
                    onSubmit={this.handleSubmit}
                    noValidate={true}
                    autoComplete="off"
                  >
                    {this.state.activeStep === 0 ? (
                      <UserInfoForm
                        title="Personal Info"
                        email={this.state.email}
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        phone={this.state.phone}
                        password={this.state.password}
                        updateValue={this.updateValue}
                      />
                    ) : this.state.activeStep === 1 ? (
                      <BusinessInfoFrom
                        title="Business Info"
                        name={this.state.name}
                        address={this.state.address}
                        city={this.state.city}
                        state={this.state.state}
                        zipcode={this.state.zipcode}
                        description={this.state.description}
                        coverImage={this.state.coverImage}
                        coverImagePath={this.state.coverImagePath}
                        updateValue={this.updateValue}
                      />
                    ) : (
                      <Card className={classes.reviewContent} elevation={0}>
                        <CardHeader
                          title={
                            'Are you sure you want to create this business?'
                          }
                        />
                        <CardMedia
                          image={this.state.coverImage}
                          style={{ height: 250 }}
                        />
                        <CardContent>
                          <Typography
                            variant="h5"
                            component="p"
                            color="textSecondary"
                            align="center"
                          >
                            {this.state.name}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            component="p"
                            align="center"
                          >
                            {this.state.address}
                            <br />
                            {this.state.city}, {this.state.state}{' '}
                            {this.state.zipcode}
                          </Typography>
                        </CardContent>

                        <CardActions style={{ justifyContent: 'center' }}>
                          <AdornedButton
                            className={classes.button}
                            color="primary"
                            variant="contained"
                            type="submit"
                            loading={this.state.loading}
                          >
                            Create Business
                          </AdornedButton>
                        </CardActions>
                      </Card>
                    )}
                  </form>
                  <MobileStepper
                    variant="dots"
                    steps={3}
                    position="bottom"
                    activeStep={this.state.activeStep}
                    nextButton={
                      <Button
                        size="small"
                        variant="text"
                        onClick={this.handleNext}
                        disabled={
                          !this.state.validForm || this.state.activeStep === 2
                        }
                      >
                        Continue
                        {<KeyboardArrowRight />}
                      </Button>
                    }
                    backButton={
                      <Button
                        size="small"
                        onClick={this.handlePrev}
                        disabled={this.state.activeStep === 0}
                      >
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

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    card: {
      padding: '4px',
      overflow: 'auto',
      borderRadius: '0px',
      boxShadow: 'none',
    },
    form: {
      borderRadius: '0px',
      boxShadow: 'none',
    },
    title: {
      textAlign: 'center',
      fontSize: 24,
    },
    businessButton: {
      backgroundColor: theme.palette.secondary.dark,
      color: 'white',
      borderRadius: '30px',
      height: '50px',
      boxShadow: 'none',
      marginTop: '10px',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.primary.light,
        boxShadow: 'none',
      },
      paddingTop: theme.spacing(2),
    },
    reviewContent: {
      paddingTop: theme.spacing(1),
      flexGrow: 1,
    },
    createButtonDiv: {
      margin: theme.spacing(3),
    },
    spinner: {
      marginLeft: theme.spacing(2),
    },
  });

const SpinnerAdornment = withStyles(styles, { withTheme: true })(
  (props: any) => {
    const { classes } = props;
    return (
      <CircularProgress
        className={classes.spinner}
        size={20}
        color="secondary"
      />
    );
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

export default connect(
  mapStateToProps,
  actionCreators,
)(withStyles(styles, { withTheme: true })(BusinessSignUp));
