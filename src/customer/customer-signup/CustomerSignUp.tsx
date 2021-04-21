import React from 'react';
import {
  Button,
  Theme,
  createStyles,
  Card,
  withStyles,
  Grid,
  CardContent,
  Typography,
  CardActions,
  CardMedia,
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
  Snackbar
} from '@material-ui/core';
import { createNewCustomer } from '../../shared/store/actions';
import { connect } from 'react-redux';
import { auth, firestore } from '../../config/FirebaseConfig';
import { Image, ArrowBack, ArrowForward, Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import UserInfoForm from '../../shared/sign-up/UserInfoForm';

type State = {
  open: boolean;
  loading: boolean;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  validForm: boolean;
  customerId: string;
  isEmployee: boolean;
  businesses: any[];
  selectedBusiness: {} | undefined;
  snackbar: {
    open: boolean;
    message: string;
    type: "error" | "success" | "info" | "warning" | undefined;
  };
};

function mapStateToProps(state: State) {
  return {};
}

class CustomerSignUp extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      loading: false,
      validForm: false,
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      customerId: '',
      isEmployee: false,
      businesses: [],
      selectedBusiness: undefined,
      snackbar: {
        open: false,
        message: '',
        type: undefined,
      },
    };
  }

  componentDidMount() {
    const businesses = this.state.businesses;

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

    this.setState({ ...this.state, businesses });
  }

  updateValue = (name: string, value: string, valid: boolean) => {
    this.setState({ ...this.state, validForm: valid, [name]: value });
  };

  handleSubmit = (
    event: React.FormEvent<HTMLButtonElement> &
      React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (this.state.validForm) {
      this.createNewCustomer();
    } else {
      console.log('Invalid form');
    }
  };

  toggleIsEmployee = (event: React.MouseEvent<HTMLButtonElement>) => {
    const selectedBusiness = this.state.selectedBusiness !== undefined;
    this.setState({
      ...this.state,
      isEmployee: !this.state.isEmployee,
      validForm: selectedBusiness,
    });
  };

  openDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ ...this.state, open: true });
  };

  closeDialog = (event: React.MouseEvent<HTMLElement>) => {
    alert('Are you sure you want to cancel creating your account?');
    this.setState({ ...this.state, open: false });
  };

  handleCloseSnackbar = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      ...this.state,
      snackbar: { open: false, message: '', type: undefined },
    });
  };

  openSnackbar = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      ...this.state,
      snackbar: { open: true, message: 'Testing 1 2 3', type: "success" },
    });
  };

  handleBusinessSelect = (business) => {
    const valid = business !== undefined && this.state.isEmployee;
    this.setState({
      ...this.state,
      selectedBusiness: business,
      validForm: valid,
    });
  };

  dispatchCreateCustomer = (newCustomerId: string) => (newCustomer: any) => {
    this.props.createNewCustomer(newCustomerId, newCustomer);
  };

  createNewCustomer = () => {
    this.setState({ ...this.state, loading: true });

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
              .doc(res.user?.uid)
              .set(newUser)
              .then(() => {
                console.log(`Created new user with id: ${res.user?.uid}`);
              })
              .catch((e) => {
                console.log(e);
              })
              .finally(() => {
                this.setState({
                  ...this.state,
                  loading: false,
                  snackbar: {
                    open: true,
                    message: 'Successfully created your account',
                    type: "success",
                  },
                });
              });
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((err) => {
        let message = ''
        switch (err.code) {
          case 'auth/email-already-in-use':
            message = 'This email is already in use.';
            break;
          case 'auth/invalid-email':
            message = 'This email is invalid.';
            break;
          case 'auth/weak-password':
            message = 'This password is too weak.';
            break;
          default:
            break;
        }

        this.setState({
          ...this.state,
          validForm: false,
          loading: false,
          snackbar: {
            open: true,
            message,
            type: 'error'
          },
        });
      });
  };

  render() {
    const { classes } = this.props;
    const { snackbar } = this.state;

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
          Customer
        </Button>
        <Dialog
          open={this.state.open}
          fullScreen={true}
          disableBackdropClick={true}
        >
          <Card className={classes.card} elevation={0}>
            <form
              className={classes.formRoot}
              onSubmit={this.handleSubmit}
              autoComplete="off"
            >
              <CardContent>
                <Fab
                  color="primary"
                  size="small"
                  variant="extended"
                  onClick={this.closeDialog}
                >
                  <ArrowBack />
                  &nbsp;Back
                </Fab>
                <UserInfoForm
                  title="Create Account"
                  email={this.state.email}
                  firstName={this.state.firstName}
                  lastName={this.state.lastName}
                  phone={this.state.phone}
                  password={this.state.password}
                  updateValue={this.updateValue}
                />

                <Grid
                  container={true}
                  spacing={1}
                  className={classes.businessSection}
                  justify="space-around"
                >
                  <Grid item={true} xs={8}>
                    <FormControlLabel
                      label="Are you an employee?"
                      labelPlacement="start"
                      value="Start"
                      control={
                        <Checkbox
                          color="primary"
                          value={this.state.isEmployee}
                          onClick={this.toggleIsEmployee}
                        />
                      }
                    />
                  </Grid>
                </Grid>
                <BusinessSearchComponent
                  businesses={this.state.businesses}
                  isEmployee={this.state.isEmployee}
                  selectedBusiness={this.state.selectedBusiness}
                  onBusinessSelect={this.handleBusinessSelect}
                />
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
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={this.handleCloseSnackbar}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={this.handleCloseSnackbar}
                >
                  <Close />
                </IconButton>
              </React.Fragment>
            }
          >
            <Alert onClose={this.handleCloseSnackbar} severity={snackbar.type} variant="filled" elevation={6}>
              { snackbar.message }
            </Alert>
          </Snackbar>
        </Dialog>
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
      padding: '4px',
      height: '100vh',
      overflow: 'auto',
    },
    title: {
      textAlign: 'center',
      fontSize: 24,
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
    businessSection: {
      paddingTop: theme.spacing(4),
    },
    button: {
      maxWidth: '200px',
      margin: theme.spacing(2),
    },
    spinner: {
      marginLeft: theme.spacing(2),
    },
    listRoot: {
      width: '100%',
      maxHeight: '300px',
      overflow: 'auto',
      backgroundColor: theme.palette.secondary.main,
    },
    selectedBusiness: {
      marginTop: theme.spacing(2),
    },
    businessRoot: {
      display: 'flex',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    businessDetails: {
      display: 'flex',
      flexDirection: 'column',
    },
    businessContent: {
      flex: '1 0 auto',
    },
    businessChange: {
      display: 'flex',
      justifyContent: 'start',
      paddingLeft: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
    businessImage: {
      width: 130,
      height: 130,
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

const BusinessSearchComponent = withStyles(styles, { withTheme: true })(
  (props: any) => {
    const { classes, isEmployee, selectedBusiness, businesses } = props;

    function handleClick(business) {
      props.onBusinessSelect(business);
    }

    function handleChange() {
      props.onBusinessSelect(undefined);
    }

    return isEmployee && !selectedBusiness ? (
      <List
        subheader={
          <ListSubheader>
            Please select <strong>your</strong> business from below
          </ListSubheader>
        }
        className={classes.listRoot}
      >
        {businesses.map((business, idx) => {
          return (
            // tslint:disable-next-line: jsx-no-lambda
            <ListItem key={idx} onClick={() => handleClick(business)}>
              <ListItemAvatar>
                <Avatar>
                  {business.image === 'Add Image' ? (
                    <Image />
                  ) : (
                    <Avatar src={business.image} />
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={business.name}
                secondary={business.location}
              />
            </ListItem>
          );
        })}
      </List>
    ) : isEmployee ? (
      <div className={classes.selectedBusiness}>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          style={{ textAlign: 'center' }}
        >
          You are attempting to join:
        </Typography>
        <Card className={classes.businessRoot} elevation={0}>
          <div className={classes.businessDetails}>
            <Grid container={true} justify="space-between">
              <Grid item={true} xs={8}>
                <CardContent className={classes.businessContent}>
                  <Typography variant="h5" component="h5">
                    {selectedBusiness.name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {selectedBusiness.location}
                  </Typography>
                </CardContent>
                <div className={classes.businessChange}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleChange}
                  >
                    Change
                  </Button>
                </div>
              </Grid>
              <Grid item={true} xs={4}>
                <CardMedia
                  className={classes.businessImage}
                  image={selectedBusiness.image}
                  title="Business Image"
                />
              </Grid>
            </Grid>
          </div>
        </Card>
        <Alert severity="info">
          This will require approval from the business.
        </Alert>
      </div>
    ) : (
      <div />
    );
  },
);

export default connect(mapStateToProps, { createNewCustomer })(
  withStyles(styles, { withTheme: true })(CustomerSignUp),
);
