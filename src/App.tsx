import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  colors,
  createMuiTheme,
  createStyles,
  Theme,
  ThemeProvider,
  withStyles,
} from '@material-ui/core';

import BusinessInfo from './business/business-info/BusinessInfo';
import BusinessHome from './business/business-home/BusinessHome';
import BusinessAccountInfo from './business/business-signup/BusinessInfoForm';
import BusinessSignUp from './business/business-signup/BusinessSignUp';
import BusinessPersonalInfo from './business/business-signup/BusinPersInfoPage';

import LandingDefault from './shared/landing-page/LandingPage';
import LandingLoggedIn from './shared/landing-page/LandingPageLog';

import SignupPage from './shared/sign-up/SignUpPage';
import CustomerSignUp from './customer/customer-signup/CustomerSignUp';

import AppointmentsPage from './customer/customer-appointments/AppointmentPage';
import BusinessProfile from './business/business-profile/business-profile';
import LoginDialog from './shared/login/loginDefault';

import { auth, firestore } from './config/FirebaseConfig';
import { connect } from 'react-redux';
import { StoreState, SystemState } from './shared/store/types';
import { updateUser } from './shared/store/actions';
import TempLoginPage from './shared/TempLoginPage';

const routes = [
  /* { path: "/help", component: Help },
  { path: "/messages", component: Messages },
  { path: "/payment", component: PaymentInfo },
  { path: "/settings", component: Settings }, */
  { path: '/appointments', component: AppointmentsPage },
  { path: '/business-info', component: BusinessInfo },
  { path: '/business-sign-up', component: BusinessSignUp },
  { path: '/business-account-info', component: BusinessAccountInfo },
  { path: '/business-personal-info', component: BusinessPersonalInfo },
  { path: '/landing-page-default', component: LandingDefault },
  { path: '/landing-page-loggedIn', component: LandingLoggedIn },
  { path: '/sign-up-page', component: SignupPage },
  { path: '/customer-sign-up', component: CustomerSignUp },
  { path: '/temp-login', component: TempLoginPage },
  { path: '/business-home', component: BusinessHome },
  { path: '/login-page', component: LoginDialog },
];

//let currentUser = 'business';
//let currentPage = 'business-home';

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
    system: state.system,
  };
}

//interface Props extends WithStyles<typeof styles> {}

class App extends React.Component<any, SystemState> {
  constructor(props: any) {
    super(props);
    auth.signOut();
    this.state = {
      loggedIn: props.system.loggedIn,
      session: props.system.session,
      user: props.system.user,
    };
  }

  render() {
    const { classes } = this.props;

    const page = () => {
      if(this.props.system.user)
      {
        if(this.props.system.user.customerId !== '')
        {
          return (<LandingLoggedIn />);
        }
        if(this.props.system.user.employeeId !== '')
        {
          return (<BusinessHome />);
        }
      }
      else 
        return (<LandingDefault />);
    }

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
            
            <div> {page()}</div>
          </Switch>
          </Router>
        </ThemeProvider>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      height: '100vh',
    },
  });

export default connect(mapStateToProps, { updateUser })(
  withStyles(styles, { withTheme: true })(App),
);
