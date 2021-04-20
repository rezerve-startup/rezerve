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
  Select,
  NativeSelect,
  FormControl,
  InputLabel,
  MenuItem,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';
import { states } from './StateArray';

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

interface Errors {}

interface NonStyleProps {
  title: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  description: string;
  coverImage: string;
  updateValue: (name: string, value: string, valid: boolean) => void;
}

interface RootState {
  errors: Errors;
  snackbar: {
    open: boolean;
    message: string;
    type: 'error' | 'success' | undefined;
  };
}

type Props = NonStyleProps & WithStyles<'root' | 'title' | 'card'>;

const DecoratedBusinessInfoForm = withStyles(styles, { withTheme: true })(
  class BusinessInfoForm extends React.Component<Props, RootState> {
    constructor(props: Props) {
      super(props);
      this.state = {
        errors: {},
        snackbar: {
          open: false,
          message: '',
          type: undefined,
        },
      };
    }

    componentDidMount() {
      this.validateForm();
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
        this.props.name === '' ||
        this.props.address === '' ||
        this.props.city === '' ||
        this.props.zipcode === ''
      ) {
        valid = false;
      }

      return valid;
    };

    handleChange = (
      event:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<{ name?: string; value: unknown }>,
    ) => {
      event.preventDefault();
      const name = event.target.name;
      const value = event.target.value;

      const errors = this.state.errors;

      /* switch (name) {
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
      } */

      this.setState({ ...this.state, errors });
      const valid = this.validateForm();
      if (name) {
        this.props.updateValue(name, value as string, valid);
      }
    };

    render() {
      const { classes } = this.props;
      const { errors } = this.state;

      return (
        <div className={classes.root}>
          <Card className={classes.card} elevation={0}>
            <CardContent style={{ padding: '4px' }}>
              <Typography
                className={classes.title}
                gutterBottom={true}
                variant="overline"
                component="p"
              >
                {this.props.title}
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
                    name="name"
                    label="Business Name"
                    value={this.props.name}
                    fullWidth={true}
                    onChange={this.handleChange}
                    /* error={errors.name.length > 0}
                    helperText={errors.name} */
                    required={true}
                    variant="outlined"
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    name="address"
                    label="Address"
                    value={this.props.address}
                    fullWidth={true}
                    onChange={this.handleChange}
                    required={true}
                    variant="outlined"
                  />
                </Grid>
                <Grid item={true} xs={6}>
                  <TextField
                    name="city"
                    label="City"
                    value={this.props.city}
                    fullWidth={true}
                    onChange={this.handleChange}
                    required={true}
                    variant="outlined"
                  />
                </Grid>
                <Grid item={true} xs={3}>
                  <FormControl variant="outlined">
                    <InputLabel>State</InputLabel>
                    <Select
                      name="state"
                      label="State"
                      fullWidth={true}
                      value={this.props.state}
                      onChange={this.handleChange}
                      required={true}
                      inputProps={{
                        name: 'state',
                      }}
                      displayEmpty={true}
                      renderValue={(value) => `${value}`}
                      variant="outlined"
                    >
                      <MenuItem value='' />
                      {states.map((state, index) => (
                        <MenuItem key={index} value={state.value}>
                          {state.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item={true} xs={3}>
                  <TextField
                    name="zipcode"
                    label="Zip"
                    value={this.props.zipcode}
                    fullWidth={true}
                    onChange={this.handleChange}
                    required={true}
                    variant="outlined"
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    name="description"
                    label="Business Description"
                    value={this.props.description}
                    onChange={this.handleChange}
                    fullWidth={true}
                    multiline={true}
                    rows={4}
                    variant="outlined"
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  Link to Photo
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      );
    }
  },
);

export default DecoratedBusinessInfoForm;
