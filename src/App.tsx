import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import Sidebar from './shared/sidebar/sidebar';
import './CSS/App.css';

// import Help from './pagesRoute/Help'
// import Messages from './pagesRoute/Messages'
// import PaymentInfo from './pagesRoute/PaymentInfo'
// import Settings from './pagesRoute/Settings'
import AppointmentsPage from './customer/customer-appointments/AppointmentPage';
// import Services from './business/business-services/Services';
// import Receipt from './customer/customer-reciept/Reciept.js';
import BusinessInfo from './business/business-info/BusinessInfo';
import BusinessInfoDetails from './business/business-info/business-info-details/BusinessInfoDetails';
import BusinessHome from './business/business-home/BusinessHome';
import store from './shared/store/store';

const routes = [
  // { path: "/help", component: Help },
  // { path: "/messages", component: Messages },
  // { path: "/payment", component: PaymentInfo },
  // { path: "/settings", component: Settings },
  { path: '/appoinments', component: AppointmentsPage },
  { path: '/business-info', component: BusinessInfo },
  { path: '/business-info-details', component: BusinessInfoDetails },
];

let currentUser = 'business';

const useStyles = makeStyles({
  root: {
    flex: 1,
    height: '100vh',
  },
});

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

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        {currentUser === 'business' && (
          <BusinessInfo />
        )}

        {currentUser === 'customer' && (
          <AppointmentsPage />
        )}
        {/* <Router>
          <Sidebar />
          <Switch>
            {routes.map((route, i) => (
              <Route
                key={i}
                path={route.path}
                exact={true}
                component={route.component}
              />
            ))}
          </Switch>
        </Router>
        <BusinessHome />
        </Router> */}
      </ThemeProv4ider>
    </div>
  );
};

export default App;
