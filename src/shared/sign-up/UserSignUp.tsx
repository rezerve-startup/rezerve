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
import { createNewCustomer } from '../../shared/store/actions';
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

interface Errors {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

type State = {
  open: boolean;
  loading: boolean;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  showPassword: boolean;
  validForm: boolean;
  customerId: string;
  isEmployee: boolean;
  businesses: any[];
  selectedBusiness: {} | undefined;
  errors: Errors;
  snackbar: {
    open: boolean;
    message: string;
    type: 'error' | 'success' | undefined;
  };
};

function mapStateToProps(state: State) {
  return {};
}

class UserSignUp extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      loading: false,
      validForm: false,
      email: 'testuser@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '501-888-8888',
      password: 'password',
      showPassword: false,
      customerId: '',
      isEmployee: false,
      businesses: [],
      selectedBusiness: undefined,
      errors: {
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
      },
      snackbar: {
        open: false,
        message: '',
        type: undefined,
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleShowPassword = this.toggleShowPassword.bind(this);
    this.toggleIsEmployee = this.toggleIsEmployee.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.openSnackbar = this.openSnackbar.bind(this);
    this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    this.handleBusinessSelect = this.handleBusinessSelect.bind(this);
    this.createNewCustomer = this.createNewCustomer.bind(this);
  }

  componentDidMount() {
    this.validateForm(this.state.errors);

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

  validateEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePhone(phone: string): boolean {
    const phoneNumber = parsePhoneNumber(phone);
    return phoneNumber.isValid();
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
        const num = new AsYouType('US');
        num.input(value);
        errors.phone = num.isValid() ? '' : 'Phone number is not valid';
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
  }

  toggleShowPassword(event: React.MouseEvent<HTMLButtonElement>) {
    this.setState({ ...this.state, showPassword: !this.state.showPassword });
  }

  toggleIsEmployee(event: React.MouseEvent<HTMLButtonElement>) {
    this.setState({ ...this.state, isEmployee: !this.state.isEmployee });
  }

  openDialog(event: React.MouseEvent<HTMLButtonElement>) {
    this.setState({ ...this.state, open: true });
  }

  closeDialog(event: React.MouseEvent<HTMLElement>) {
    alert('Are you sure you want to cancel creating your account?');
    this.setState({ ...this.state, open: false });
  }

  handleCloseSnackbar(
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string,
  ) {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      ...this.state,
      snackbar: { open: false, message: '', type: undefined },
    });
  }

  openSnackbar(event: React.MouseEvent<HTMLButtonElement>) {
    this.setState({
      ...this.state,
      snackbar: { open: true, message: 'Testing 1 2 3', type: 'success' },
    });
  }

  handleBusinessSelect(business) {
    this.setState({ ...this.state, selectedBusiness: business });
  }

  dispatchCreateCustomer = (newCustomerId: string) => (newCustomer: any) => {
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
  }

  render() {
    const { classes } = this.props;
    const { errors, showPassword, snackbar } = this.state;

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
              noValidate={true}
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
                <Typography
                  className={classes.title}
                  gutterBottom={true}
                  variant="overline"
                  component="p"
                >
                  Create Account
                </Typography>
                <Typography
                  variant="caption"
                  component="p"
                  color="textSecondary"
                  align="center"
                >
                  * means required
                </Typography>
                <Grid container={true} spacing={2} style={{ marginTop: '4px' }}>
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
                      variant="outlined"
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
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={this.toggleShowPassword}>
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
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
                      variant="outlined"
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
                      variant="outlined"
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
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

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
            message={snackbar.message}
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
          />
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
      overflow: 'auto'
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
  withStyles(styles, { withTheme: true })(UserSignUp),
);
