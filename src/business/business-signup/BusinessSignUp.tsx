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
import { auth, firestore } from '../../config/FirebaseConfig';
import {
  ArrowBack,
  ArrowForward,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@material-ui/icons';
import { updateUser } from '../../shared/store/actions';
import { StoreState, SystemState } from '../../shared/store/types';
import BusinessRegisterLogin from './BusinessRegisterLogin';
import UserInfoForm from '../../shared/sign-up/UserInfoForm';
import BusinessInfoFrom from './BusinessInfoForm';

interface Errors {
  email: string;
  password: string;
}

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
}

type State = ComponentState & SystemState;

class BusinessSignUp extends React.Component<any, State> {
  _isMounted = false;

  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      loading: false,
      activeStep: 0,
      validForm: false,
      creatingUserAccount: false,
      errors: {
        email: '',
        password: '',
      },
      snackbar: {
        open: false,
        message: '',
        type: undefined,
      },
      employeeId: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
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

    this.signInUser = this.signInUser.bind(this);
    this.dispatchUpdateUser = this.dispatchUpdateUser.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    auth.onAuthStateChanged((user) => {
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
                phone: userObj?.phone
              });
            });
        }
      } else {
        this.setState({ ...this.state, loggedIn: false, activeStep: 0 });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  dispatchUpdateUser(newUser) {
    this.props.updateUser(newUser);
  }

  signInUser(email: string, password: string) {
    auth
      .signInWithEmailAndPassword(email, password)
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
              // this.setState({ ...this.state, activeStep: 1, loggedIn: true })
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
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
    console.log('Signing up...');
    this.setState({ ...this.state, creatingUserAccount: true });
    // this.openDialog()
  };

  openDialog = () => {
    this.setState({ ...this.state, open: true });
  };

  closeDialog = () => {
    alert('Are you sure you want to cancel creating your account?');
    this.setState({ ...this.state, open: false, creatingUserAccount: false });
  };

  async createNewUser() {
    this.setState({ ...this.state, loading: true });
    let employeeId: string | undefined = '';
    const errors = this.state.errors;

    const emailToUse = this.state.email;
    const passwordToUse = this.state.password;

    await auth
      .createUserWithEmailAndPassword(emailToUse, passwordToUse)
      .then((res) => {
        const employeeData = {
          businessId: '',
          position: 'Stylist',
          isOwner: true,
          todos: [],
          clients: [],
          appointments: [],
        };

        firestore
          .collection('employees')
          .add(employeeData)
          .then((docRef) => {
            employeeId = docRef.id;
            const newUser = {
              employeeId: docRef.id,
              email: this.state.email,
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              phone: this.state.phone,
              customerId: '',
            };

            firestore
              .collection('users')
              .doc(res.user?.uid)
              .set(newUser)
              .then(() => {
                console.log(`Created new user with id: ${res.user?.uid}`);
              })
              .catch((e) => {
                console.log(e);
              });
          })
          .catch((e) => {
            console.log(e);
          });
        /* console.log("Returning first function", res.user?.uid) */
        /* const ret = new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(res.user?.uid)
          }, 3000)
        })  */
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

        this.setState({
          ...this.state,
          validForm: false,
          errors,
          activeStep: 0,
        });
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
  }

  async createNewBusiness() {
    let emailToUse = this.state.email;
    let passwordToUse = this.state.password;

    let employeeId: any = ''
    if (this.state.creatingUserAccount) {
      console.log('here');

      auth
      .createUserWithEmailAndPassword(emailToUse, passwordToUse)
      .then((res) => {
        const uid = res
        console.log('res', res, this.state.employeeId)

        const employeeData = {
          businessId: '',
          position: 'Stylist',
          isOwner: true,
          todos: [],
          clients: [],
          appointments: [],
        };

        firestore
          .collection('employees')
          .add(employeeData)
          .then((docRef) => {
            const employeeId = docRef.id;
            const newUser = {
              employeeId: docRef.id,
              email: this.state.email,
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              phone: this.state.phone,
              customerId: '',
            };

            firestore
              .collection('users')
              .doc(res.user?.uid)
              .set(newUser)
              .then(() => {
                console.log(`Created new user with id: ${res.user?.uid}`);

                firestore
                  .collection('users')
                  .doc(`${uid}`)
                  .get()
                  .then((snapshot) => {
                    const userObj = snapshot.data()

                    const businessData = {
                      name: this.state.name,
                      numWorkers: 1,
                      description: this.state.description,
                      about: {
                        address: this.state.address,
                        city: this.state.city,
                        state: this.state.state,
                        zipcode: this.state.zipcode,
                        daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                        closingTime: '17:00',
                        openingTime: '8:00',
                      },
                      employees: [`${employeeId}`],
                    };
        
                    firestore
                      .collection('businesses')
                      .add(businessData)
                      .then((docRef) => {
                        console.log('business', docRef.id)
                        console.log('employee', employeeId);
                        firestore
                          .collection('employees')
                          .doc(employeeId)
                          .update({
                            businessId: docRef.id,
                          }).then(() => {
                            this.setState({ ...this.state, open: false });
                            auth.signOut().then(() => {
                              auth.signInWithEmailAndPassword(emailToUse, passwordToUse);
                            })

                          })
                        .catch((e) => {
                          console.log(e);
                        });
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
              })
              .catch((e) => {
                console.log(e);
              });
          })
          .catch((e) => {
            console.log(e)
          })
      })
      .catch((e) => {
        console.log(e)
      })
    } else {
      employeeId = this.state.user?.uid

      const businessData = {
        name: this.state.name,
        numWorkers: 1,
        description: this.state.description,
        about: {
          address: this.state.address,
          city: this.state.city,
          state: this.state.state,
          zipcode: this.state.zipcode,
          daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          closingTime: '17:00',
          openingTime: '8:00',
        },
        employees: [`${employeeId}`],
      };
  
      firestore
        .collection('businesses')
        .add(businessData)
        .then((docRef) => {
          firestore
            .collection('employees')
            .doc(employeeId)
            .update({
              businessId: docRef.id,
            })
            .then(() => {
              this.setState({ ...this.state, open: false })

              auth.signOut().then(() => {
                auth.signInWithEmailAndPassword(emailToUse, passwordToUse);
              })
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  render() {
    const { classes } = this.props;
    const { errors, snackbar, loggedIn, creatingUserAccount } = this.state;

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

export default connect(mapStateToProps, { updateUser })(
  withStyles(styles, { withTheme: true })(BusinessSignUp),
);
