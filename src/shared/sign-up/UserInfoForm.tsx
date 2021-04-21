import React from 'react';
import {
  Theme,
  createStyles,
  TextField,
  Card,
  withStyles,
  Grid,
  CardContent,
  Typography,
  InputAdornment,
  IconButton,
  WithStyles,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
    },
    card: {
      padding: '4px',
      overflow: 'auto',
    },
    title: {
      textAlign: 'center',
      fontSize: 24,
    },
  });

interface Errors {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

interface NonStyleProps {
  title: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  updateValue: (name: string, value: string, valid: boolean) => void;
}

interface RootState {
  showPassword: boolean;
  errors: Errors;
  snackbar: {
    open: boolean;
    message: string;
    type: 'error' | 'success' | undefined;
  };
}

type Props = NonStyleProps & WithStyles<'root' | 'title' | 'card'>;

const DecoratedUserInfoForm = withStyles(styles, { withTheme: true })(
  class UserInfoForm extends React.Component<Props, RootState> {
    constructor(props: Props) {
      super(props);
      this.state = {
        showPassword: false,
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
    }

    componentDidMount() {
      const valid = this.validateForm();
      this.props.updateValue('email', this.props.email, valid)
    }

    validateEmail(email: string): boolean {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    validatePhone(phone: string): boolean {
      const phoneNumber = parsePhoneNumber(phone);
      return phoneNumber.isValid();
    }

    validateForm = () => {
      let valid = true;
      Object.values(this.state.errors).forEach(
        (val: string) => val.length > 0 && (valid = false),
      );

      if (
        this.props.email === '' ||
        this.props.password === '' ||
        this.props.firstName === '' ||
        this.props.lastName === ''
      ) {
        valid = false;
      }

      return valid;
    };

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

      this.setState({ ...this.state, errors });
      const valid = this.validateForm();
      this.props.updateValue(name, value, valid);
    };

    toggleShowPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      this.setState({ ...this.state, showPassword: !this.state.showPassword });
    };

    render() {
      const { classes } = this.props;
      const { errors, showPassword } = this.state;

      return (
        <div className={classes.root}>
          <Card className={classes.card} elevation={0}>
            <CardContent>
              <Typography
                className={classes.title}
                gutterBottom={true}
                variant="overline"
                component="p"
              >
                { this.props.title }
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
                    value={this.props.email}
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
                    value={this.props.password}
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
                            {showPassword ? <Visibility /> : <VisibilityOff />}
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
                    value={this.props.firstName}
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
                    value={this.props.lastName}
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
                    value={this.props.phone}
                    fullWidth={true}
                    onChange={this.handleChange}
                    error={errors.phone.length > 0}
                    helperText={errors.phone}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      );
    }
  },
);

export default DecoratedUserInfoForm;
