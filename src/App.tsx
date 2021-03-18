import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Button, createMuiTheme, createStyles, Theme, ThemeProvider, withStyles, WithStyles } from '@material-ui/core';
import Sidebar from './shared/sidebar/sidebar';

import BusinessInfo from './business/business-info/BusinessInfo';
import BusinessHome from './business/business-home/BusinessHome';
import BusinessAccountInfo from './business/business-signup/BusinAccInfo';
import BusinessSignUp from './business/business-signup/BusinSignUp';
import BusinessPersonalInfo from './business/business-signup/BusinPersInfoPage'

import LandingDefault from './shared/landing-page/LandingPage';
import LandingLoggedIn from './shared/landing-page/LandingPageLog';

import SignupPage from './shared/SignUpPage'
import CustomerSignUp from './customer/customer-signup/CustomerCreationPage'

import AppointmentsPage from './customer/customer-appointments/AppointmentPage';
import { auth, firestore } from './config/FirebaseConfig';
import { connect } from 'react-redux';
import { StoreState, SystemState } from './shared/store/types';
import { updateUser } from './shared/store/actions';



const routes = [
  /* { path: "/help", component: Help },
  { path: "/messages", component: Messages },
  { path: "/payment", component: PaymentInfo },
  { path: "/settings", component: Settings }, */
  { path: '/appoinments', component: AppointmentsPage },
  { path: '/business-info', component: BusinessInfo },
  { path: '/business-sign-up', component: BusinessSignUp },
  { path: '/business-account-info', component: BusinessAccountInfo },
  { path: '/business-personal-info', component: BusinessPersonalInfo },
  { path: '/landing-page-default', component: LandingDefault },
  { path: '/landing-page-loggedIn', component: LandingLoggedIn },
  { path: '/sign-up-page', component: SignupPage},
  { path: '/customer-sign-up', component: CustomerSignUp},
];

let currentUser = 'business';
let currentPage = 'business-home';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FE8488',
      light: '#FF6D6D',
      dark: '#FF2B2B',
    },
    secondary: {
      main: '#5B5B5B',
      light: '#D7D7D7',
      dark: '#353535',
    },
  },
});

function mapStateToProps(state: StoreState) {
  return {
    system: state.system
  }
}

interface Props extends WithStyles<typeof styles> {}

class App extends React.Component<any, SystemState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loggedIn: props.system.loggedIn,
      session: props.system.session,
      user: props.system.user,
    }
  }

  componentDidMount(): void {
    this.loginEmployee();
  }

  dispatchUpdateUser = (newUser) => {
    this.props.updateUser(newUser)
  }


  loginEmployee() {
    // Other account is 'testcustomer@test.com', 'testcustomer'
    auth.signInWithEmailAndPassword('testemployee@test.com', 'testemployee')
      .then((userCredential) => {
        if (userCredential !== null && userCredential.user) {
          const user = userCredential.user;

          firestore.collection('users').doc(`${user.uid}`).get()
            .then((userObj) => {
              const userInfo = userObj.data();
              this.dispatchUpdateUser(userInfo);
            });
        }
      });
  }

  loginCustomer() {
    auth.signInWithEmailAndPassword('testCustomer@test.com', 'testcustomer')
      .then((userCredential) => {
        if (userCredential !== null && userCredential.user) {
          const user = userCredential.user;

          firestore.collection('users').doc(`${user.uid}`).get()
            .then((userObj) => {
              const userInfo = userObj.data();
              this.dispatchUpdateUser(userInfo);
            });
        }
      });
  }

  logoutUser() {
    auth.signOut();
  }

  switchToEmployee = () => {
    this.logoutUser();
    this.loginEmployee();
  }

  switchToCustomer = () => {
    this.logoutUser();
    this.loginCustomer();
  }

  render() {
    const { classes } = this.props;

    return (

      <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              {routes.map((route, i) => (
                <Route
                  key={i}
                  path={route.path}
                  exact={true}
                  component={route.component}
                />
              ))}
            
          

          <div>
            {this.props.system.user !== undefined ? (
              this.props.system.user.customerId !== '' ? (
                <div>
                  {/*<div>{this.props.system.user.firstName}</div>
                  <Button variant="contained" onClick={this.switchToEmployee}>Switch to Employee</Button>
                   <AppointmentsPage />
                  <BusinessInfo /> */}
                  <LandingLoggedIn />
                </div>
              ) : (
                <div>
                  {/*<div>{this.props.system.user.firstName}</div>
                  <Button variant="contained" onClick={this.switchToCustomer}>Switch to Customer</Button>*/}
                  <LandingDefault />
                </div>
              )
            ) : (
              <div>Hello</div>
            )}
          </div>
          </Switch>
          </Router>
        </ThemeProvider>
      </div>
    );
  }
};

const styles = (theme: Theme) => 
  createStyles({
    root: {
      flex: 1,
      height: '100vh',
    },
  });

export default connect(mapStateToProps, { updateUser })(
  withStyles(styles, { withTheme: true })(App));