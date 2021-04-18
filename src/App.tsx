import React from 'react';
import { BrowserRouter as Router, Switch, Route, withRouter, Redirect } from 'react-router-dom';
import {
  createMuiTheme,
  createStyles,
  Theme,
  ThemeProvider,
  withStyles,
} from '@material-ui/core';

import BusinessInfo from './business/business-info/BusinessInfo';
import BusinessHome from './business/business-home/BusinessHome';
import BusinessAccountInfo from './business/business-signup/BusinAccInfo';
import BusinessSignUp from './business/business-signup/BusinSignUp';
import BusinessPersonalInfo from './business/business-signup/BusinPersInfoPage';

import LandingDefault from './shared/landing-page/LandingPage';
import LandingLoggedIn from './shared/landing-page/LandingPageLog';

import SignupPage from './shared/SignUpPage';
import CustomerSignUp from './customer/customer-signup/CustomerCreationPage';

import { connect } from 'react-redux';
import { StoreState, SystemState } from './shared/store/types';
import { 
  setUserEmployeeInfo,
  setUserCustomerInfo, 
  setBusinessAvailability 
} from './shared/store/actions';
import TempLoginPage from './shared/TempLoginPage';
import SignUpPage from './shared/SignUpPage';
import CustomerAppointmentHome from './customer/customer-appointments/CustomerAppointmentHome';
import MessagingHome from './shared/messaging/MessagingHome';

import CustomerCheckout from './customer/customer-checkout/CustomerCheckout';

const routes = [
  /* { path: "/help", component: Help },
  { path: "/messages", component: Messages },
  { path: "/settings", component: Settings }, */
  { path: '/appointments', component: CustomerAppointmentHome },
  { path: '/business-sign-up', component: BusinessSignUp },
  { path: '/business-account-info', component: BusinessAccountInfo },
  { path: '/business-personal-info', component: BusinessPersonalInfo },
  { path: '/landing-page-default', component: LandingDefault },
  { path: '/landing-page-loggedIn', component: LandingLoggedIn },
  { path: '/sign-up-page', component: SignupPage },
  { path: '/customer-sign-up', component: CustomerSignUp },
  { path: '/temp-login', component: TempLoginPage },
  { path: '/business-home', component: BusinessHome },
  { path: '/', component: LandingDefault }
];

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
    user: state.system.user
  };
}

//interface Props extends WithStyles<typeof styles> {}

class App extends React.Component<any, SystemState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loggedIn: props.system.loggedIn,
      session: props.system.session,
      user: props.system.user,
      authChanging: props.system.authChanging,
      bookDialogStatus: props.system.bookDialogStatus
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Route path={'/'} exact={true} component={LandingDefault}/>
              <Route path={'/business-sign-up'} exact={true} component={BusinessSignUp}/>
              <Route path={'/business-account-info'} exact={true} component={BusinessAccountInfo}/>
              <Route path={'/business-personal-info'} exact={true} component={BusinessPersonalInfo}/>
              <Route path={'/sign-up-page'} exact={true} component={SignUpPage}/>
              <Route path={'/customer-sign-up'} exact={true} component={CustomerSignUp}/>
              <Route path={'/temp-login'} exact={true} component={TempLoginPage}/>
              <Route path={'/appointments'} exact={true} component={CustomerAppointmentHome}/>
              <Route path={'/customer-home'} exact={true} component={LandingLoggedIn}/>
              <Route path={'/business-home'} exact={true} component={BusinessHome}/>
              <Route path={'/messages'} exact={true} component={MessagingHome}/>
              <Route path={'**'} exact><Redirect to={'/'}></Redirect></Route>
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
      width: '100vw'
    },
  });

export default connect(mapStateToProps, { setUserCustomerInfo, setUserEmployeeInfo, setBusinessAvailability })(
  withStyles(styles, { withTheme: true })(
    App
  )
);
