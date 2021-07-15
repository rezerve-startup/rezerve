import {
  createMuiTheme,
  createStyles,
  Theme,
  ThemeProvider,
  withStyles
} from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import BusinessHome from './business/business-home/BusinessHome';
import BusinessAccountInfo from './business/business-signup/BusinessInfoForm';
import BusinessSignUp from './business/business-signup/BusinessSignUp';
import BusinessPersonalInfo from './business/business-signup/BusinPersInfoPage';
import EmployeeHome from './business/employee-home/EmployeeHome';
import CustomerAppointmentHome from './customer/customer-appointments/CustomerAppointmentHome';
import CustomerSignUp from './customer/customer-signup/CustomerSignup';
import LandingDefault from './shared/landing-page/LandingPage';
import LandingLoggedIn from './shared/landing-page/LandingPageLog';
import MessagingHome from './shared/messaging/MessagingHome';
import Preview from './shared/preview/about';
import SignUpPage from './shared/sign-up/SignUpPage';
import {
  setBusinessAvailability, setUserCustomerInfo, setUserEmployeeInfo
} from './shared/store/actions';
import { StoreState, SystemState } from './shared/store/types';




/*
const routes = [
  /* { path: "/help", component: Help },
  { path: "/messages", component: Messages },
  { path: "/settings", component: Settings }, 
  { path: '/appointments', component: CustomerAppointmentHome },
  { path: '/business-sign-up', component: BusinessSignUp },
  { path: '/business-account-info', component: BusinessAccountInfo },
  { path: '/business-personal-info', component: BusinessPersonalInfo },
  { path: '/landing-page-default', component: LandingDefault },
  { path: '/landing-page-loggedIn', component: LandingLoggedIn },
  { path: '/sign-up-page', component: SignUpPage },
  { path: '/customer-sign-up', component: CustomerSignUp },
  { path: '/employee-home', component: EmployeeHome },
  { path: '/business-home', component: BusinessHome },
  { path: '/login-page', component: LoginDialog },
  { path: '/', component: LandingDefault },
];
*/
const themeColors = createMuiTheme({
  palette: {
    primary: {
      main: '#FE8488',
      light: '#FF6D6D',
      dark: '#f00604',
    },
    secondary: {
      main: '#5B5B5B',
      light: '#e2e2e2',
      dark: '#232323',
    },
  },
});

function mapStateToProps(state: StoreState) {
  return {
    system: state.system,
    user: state.system.user
  };
}

// interface Props extends WithStyles<typeof styles> {}

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
/*
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
*/
    return (
      <div className={classes.root}>
        <ThemeProvider theme={themeColors}>
          <Router>
            <Switch>
              <Route path={'/'} exact={true} component={LandingDefault}/>
              <Route path={'/preview'} exact={true} component={Preview}/>
              <Route path={'/business-sign-up'} exact={true} component={BusinessSignUp}/>
              <Route path={'/business-account-info'} exact={true} component={BusinessAccountInfo}/>
              <Route path={'/business-personal-info'} exact={true} component={BusinessPersonalInfo}/>
              <Route path={'/sign-up-page'} exact={true} component={SignUpPage}/>
              <Route path={'/customer-sign-up'} exact={true} component={CustomerSignUp}/>
              <Route path={'/appointments'} exact={true} component={CustomerAppointmentHome}/>
              <Route path={'/customer-home'} exact={true} component={LandingLoggedIn}/>
              <Route path={'/employee-home'} exact={true} component={EmployeeHome} />
              <Route path={'/business-home'} exact={true} component={BusinessHome}/>
              <Route path={'/messages'} exact={true} component={MessagingHome}/>
              <Route path={'**'} exact={true}><Redirect to={'/'}/></Route>
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
