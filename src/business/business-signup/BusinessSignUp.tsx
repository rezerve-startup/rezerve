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
} from '@material-ui/core';
import { connect } from 'react-redux';
import { auth, firestore, unsubscribe } from '../../config/FirebaseConfig';
import {
  ArrowBack,
  ArrowForward,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@material-ui/icons';
import Geocode from 'react-geocode';
import firebase from 'firebase';
import { updateUser, createNewBusiness, setAuthChanging, logoutUser } from '../../shared/store/actions';
import { StoreState, SystemState } from '../../shared/store/types';
import BusinessRegisterLogin from './BusinessRegisterLogin';
import UserInfoForm from '../../shared/sign-up/UserInfoForm';
import BusinessInfoFrom from './BusinessInfoForm';
import algoliasearch from 'algoliasearch';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
Geocode.setLanguage('en');
Geocode.setLocationType('ROOFTOP');

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
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  description: string;
  coverImage: string;
}

type State = ComponentState & SystemState;

const client = algoliasearch("QDMMNJHF77", `${process.env.REACT_APP_ALGOLIA_API_KEY}`);
const index = client.initIndex("Business_Data");

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
      employeeId: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      name: '',
      type: '',
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
      bookDialogStatus: props.system.bookDialogStatus,
    };

    this.signInUser = this.signInUser.bind(this);
    this.dispatchUpdateUser = this.dispatchUpdateUser.bind(this);
    this.createNewBusiness = this.createNewBusiness.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.unsubscribe2 = auth.onAuthStateChanged((user) => {
      if (user) {
        if (this._isMounted) {
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
                email: userObj?.email,
                firstName: userObj?.firstName,
                lastName: userObj?.lastName,
                phone: userObj?.phone,
              });
            });
        }
      } else {
        if (this._isMounted) {
          this.setState({
            ...this.state,
            loggedIn: false,
            activeStep: 0,
          });
        }
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    unsubscribe();
    this.unsubscribe2();
  }

  dispatchUpdateUser(newUser) {
    this.props.updateUser(newUser);
  }

  signInUser(email: string, password: string) {
    auth.signOut();
    //auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      //.then(() => {
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
          });
      //});
  }

  updateValue = (name: string, value: string, valid: boolean) => {
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
    unsubscribe();
    this.setState({ ...this.state, open: true });
  };

  closeDialog = () => {
    alert('Are you sure you want to cancel creating your account?');
    this.setState({ ...this.state, open: false, creatingUserAccount: false });
  };

  async createNewBusiness() {
    const email = this.state.email;
    const password = this.state.password;
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const phone = this.state.phone;
    const businessName = this.state.name;
    const businessType = this.state.type;
    const businessDescription = this.state.description;
    const businessAddress = this.state.address;
    const businessCity = this.state.city;
    const businessState = this.state.state;
    const businessZipcode = this.state.zipcode;

    const address = `${this.state.address}, ${this.state.city}, ${this.state.state}, ${this.state.zipcode}`;

    await Geocode.fromAddress(address)
      .then((res) => {
        const { lat, lng } = res.results[0].geometry.location;
        const loc = new firebase.firestore.GeoPoint(lat, lng);
        if (this.state.creatingUserAccount) {
          auth
            .createUserWithEmailAndPassword(email, password)
            .then((userCreds) => {
              return userCreds.user?.uid;
            })
            .then((userUID) => {
              const newEmployeeData = {
                businessId: '',
                position: 'Stylist',
                isOwner: true,
                todos: [],
                clients: [],
                appointments: [],
                availability: [
                  { day: 'Sunday', enabled: true, start: '08:00', end: '17:00' },
                  { day: 'Monday', enabled: true, start: '08:00', end: '17:00' },
                  { day: 'Tuesday', enabled: true, start: '08:00', end: '17:00' },
                  { day: 'Wednesday', enabled: true, start: '08:00', end: '17:00' },
                  { day: 'Thursday', enabled: true, start: '08:00', end: '17:00' },
                  { day: 'Friday', enabled: true, start: '08:00', end: '17:00' },
                  { day: 'Saturday', enabled: true, start: '08:00', end: '17:00' },
                ],
              };
              const empRef = firestore.collection('employees').doc();
              const userRef = firestore.collection('users').doc(`${userUID}`);

              firestore
                .runTransaction((transaction) => {
                  return transaction.get(empRef).then((empDocRef) => {
                    const newUserData = {
                      employeeId: empDocRef.id,
                      email: email,
                      firstName: firstName,
                      lastName: lastName,
                      phone: phone,
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
                    type: businessType,
                    numWorkers: 1,
                    description: businessDescription,
                    about: {
                      address: businessAddress,
                      city: businessCity,
                      state: businessState,
                      zipcode: businessZipcode,
                      daysOpen: [
                        { 
                          day: 'Sunday',
                          enabled: true,
                          start: '08:00', 
                          end: '17:00' },
                        { 
                          day: 'Monday',
                          enabled: true,
                          start: '08:00', 
                          end: '17:00' },
                        {
                          day: 'Tuesday',
                          enabled: true,
                          start: '08:00',
                          end: '17:00',
                        },
                        {
                          day: 'Wednesday',
                          enabled: true,
                          start: '08:00',
                          end: '17:00',
                        },
                        {
                          day: 'Thursday',
                          enabled: true,
                          start: '08:00',
                          end: '17:00',
                        },
                        { 
                          day: 'Friday',
                          enabled: true,
                          start: '08:00', 
                          end: '17:00' },
                          { 
                          day: 'Saturday',
                          enabled: true,
                          start: '08:00', 
                          end: '17:00' }
                      ],
                      closingTime: '17:00',
                      openingTime: '8:00',
                      location: loc,
                    },
                    employees: [`${employeeId}`],
                    employeeRequests: [],
                    reviews: [],
                    perfomance: [],
                    overallRating: 0
                  };

                  firestore
                    .collection('businesses')
                    .add(newBusinessData)
                    .then((docRef) => {
                      firestore
                        .collection('employees')
                        .doc(employeeId)
                        .update({
                          businessId: docRef.id,
                        })
                        .then(() => {
                          auth.signOut().then(() => {
                            auth.signInWithEmailAndPassword(email, password).then(
                              (userCreds) => {
                                if (userCreds !== null && userCreds.user) {
                                  const user = userCreds.user;
                                  this.dispatchUpdateUser(user)
                                }
                                this.props.handleSignUpClose()
                                this.setState({ ...this.state, open: false });
                            });
                          });
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
                .catch((e) => {
                  console.log(e);
                });
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          auth
            .signInWithEmailAndPassword(email, password)
            .then((userCreds) => {
              return userCreds.user?.uid;
            })
            .then((userUID) => {
              const userDocRef = firestore.collection('users').doc(userUID);
              const employeeRef = firestore.collection('employees').doc();

              firestore
                .runTransaction((transaction) => {
                  return transaction.get(userDocRef).then((userDoc) => {
                    if (!userDoc.exists) {
                      throw new Error('User does not exist.');
                    } else {
                      const employeeId = userDoc.data()?.employeeId;
                      if (employeeId) {
                        console.log(
                          `Fetched employee id from existing user: ${employeeId}`,
                        );
                        return employeeId;
                      } else {
                        return transaction
                          .get(employeeRef)
                          .then((employeeDoc) => {
                            const newEmployeeData = {
                              businessId: '',
                              position: 'Stylist',
                              isOwner: true,
                              todos: [],
                              clients: [],
                              appointments: [],
                              availability: [
                                { 
                                  day: 'Sunday',
                                  enabled: true,
                                  start: '08:00', 
                                  end: '17:00' },
                                { 
                                  day: 'Monday',
                                  enabled: true,
                                  start: '08:00', 
                                  end: '17:00' },
                                {
                                  day: 'Tuesday',
                                  enabled: true,
                                  start: '08:00',
                                  end: '17:00',
                                },
                                {
                                  day: 'Wednesday',
                                  enabled: true,
                                  start: '08:00',
                                  end: '17:00',
                                },
                                {
                                  day: 'Thursday',
                                  enabled: true,
                                  start: '08:00',
                                  end: '17:00',
                                },
                                { 
                                  day: 'Friday',
                                  enabled: true,
                                  start: '08:00', 
                                  end: '17:00' },
                                  { 
                                  day: 'Saturday',
                                  enabled: true,
                                  start: '08:00', 
                                  end: '17:00' }
                              ],
                            };
                            transaction.set(employeeRef, newEmployeeData);
                            console.log(
                              `Created new employee for user: ${employeeRef.id}`,
                            );
                            return employeeRef.id;
                          });
                      }
                    }
                  });
                })
                .then((employeeId) => {
                  const newBusinessData = {
                    name: businessName,
                    type: businessType,
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
                        'Saturday',
                        'Sunday',
                      ],
                      closingTime: '17:00',
                      openingTime: '8:00',
                      location: loc,
                    },
                    employees: [`${employeeId}`],
                    employeeRequests: [],
                    reviews: [],
                    perfomance: [],
                    overallRating: 0
                  };

                  firestore
                    .collection('businesses')
                    .add(newBusinessData)
                    .then((docRef) => {
                      console.log(
                        `Created new business document: ${docRef.id}`,
                      );
                                           

                      firestore
                        .collection('employees')
                        .doc(employeeId)
                        .update({
                          businessId: docRef.id,
                        })
                        .then(() => {
                          auth.signOut().then(() => {
                            auth.signInWithEmailAndPassword(email, password).then(
                              (userCreds) => {
                                if (userCreds !== null && userCreds.user) {
                                  const user = userCreds.user;
                                  console.log("Signed in user...", user)
                                  this.dispatchUpdateUser(user)
                                }
                                this.props.handleSignUpClose()
                                this.setState({ ...this.state, open: false });
                            });
                          });
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                    })
                    .catch((e) => {
                      console.log(e);
                    });

                })
                .catch((e) => {
                  console.log(e);
                });
            })
            .catch((e) => {
              console.log(e);
            });
        }
      })
      .catch((e) => {
        console.log(e);
      })
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
            <CardContent style={{ padding: '4px' }}>
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
                    className={classes.root}
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
                        type={this.state.type}
                        address={this.state.address}
                        city={this.state.city}
                        state={this.state.state}
                        zipcode={this.state.zipcode}
                        description={this.state.description}
                        coverImage={this.state.coverImage}
                        updateValue={this.updateValue}
                      />
                    ) : (
                      <Card className={classes.reviewContent} elevation={0}>
                        <CardContent>
                          <Typography
                            variant="h5"
                            component="h5"
                            className={classes.title}
                          >
                            Are you sure you want to create this business?
                          </Typography>

                          <br />
                          <br />

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
                            onClick={() => {
                              console.log(this.state.name);
                              //Index the new business name to Algolia Search
                              //const objects = [{
                              //  objectID: docRef.id,
                              //  name: newBusinessData.name
                              //}]
                              
                              index.saveObjects([{name: this.state.name}], { autoGenerateObjectIDIfNotExist: true }); 
                            }}
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
    },
    title: {
      textAlign: 'center',
      fontSize: 24,
    },
    businessButton: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.dark,
      borderRadius: '30px',
      height: '50px',
      boxShadow: 'none',
      marginTop: '10px',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.primary.light,
        boxShadow: 'none',
      },
    },
    reviewContent: {
      paddingTop: theme.spacing(8),
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

export default connect(mapStateToProps, { updateUser, setAuthChanging, logoutUser })(
  withStyles(styles, { withTheme: true })(BusinessSignUp),
);
