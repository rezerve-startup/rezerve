import {
  Button,
  Container,
  createStyles,
  Grid,
  Theme,
  withStyles,
} from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { auth, firestore } from '../config/FirebaseConfig';
import {
  setUserEmployeeInfo,
  setUserCustomerInfo, 
  setBusinessAvailability
} from '../shared/store/actions';
import { StoreState } from './store/types';
import firebase from 'firebase';

function mapStateToProps(state: StoreState) {
  return {
    user: state.system.user
  };
}
class TempLoginPage extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
    };
  }

  dispatchSetUserEmployeeInfo = (userEmployeeInfo) => {
    this.props.setUserEmployeeInfo(userEmployeeInfo);
  }

  dispatchSetUserCustomerInfo = (userCustomerInfo) => {
    this.props.setUserCustomerInfo(userCustomerInfo)
  }

  dispatchSetBusinessAvailability = (businessAvailability) => {
    this.props.setBusinessAvailability(businessAvailability);
  }

  dispatchSetBusinessId = (businessId) => {
    this.props.setBusinessId(businessId);
  }

  loginEmployee() {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        auth
          .signInWithEmailAndPassword('testemployee@test.com', 'testemployee');
      })
  }

  loginCustomer() {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        auth.signInWithEmailAndPassword('testCustomer@test.com', 'testcustomer');
      });
  }

  signInEmployee = () => {
    this.loginEmployee();
  };

  signInCustomer = () => {
    this.loginCustomer();
  };

  render() {
    const { classes } = this.props;

    if (this.props.user) {
      if (this.props.user.employeeId === '') {
        return (
          <Redirect to={'/customer-home'} />
        )
      } else if (this.props.user.customerId === '') {
        return (
          <Redirect to={'/business-home'} />
        )
      }
    }

    return (
      <Container className={classes.root} maxWidth={false}>
        <Grid container alignItems="center" direction="column">
          <Grid item>
            <h3>Temp Login</h3>
            <Button
              variant="contained"
              className={classes.button}
              onClick={this.signInCustomer}
            >
              Customer
            </Button>
          </Grid>
          <Grid item>
            <h3>Temp Login</h3>
            <Button
              variant="contained"
              className={classes.button}
              onClick={this.signInEmployee}
            >
              Business
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.secondary.dark,
      minHeight: '100vh',
      color: theme.palette.secondary.light,
      paddingTop: 15,
    },
    button: {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
      border: '1px solid white',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.light,
      },
    },
    whiteTextPlease: {
      color: 'white',
    },
  });

export default connect(mapStateToProps, { setUserEmployeeInfo, setUserCustomerInfo, setBusinessAvailability })(
  withStyles(styles, { withTheme: true })(TempLoginPage),
);
