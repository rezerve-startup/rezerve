import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import Sidebar from './shared/sidebar/sidebar';
import './CSS/App.css';
import BusinessInfo from './business/business-info/BusinessInfo';
import BusinessInfoDetails from './business/business-info/business-info-details/BusinessInfoDetails';
import BusinessHome from './business/business-home/BusinessHome';
import AppointmentsPage from './customer/customer-appointments/AppointmentPage';

const routes = [
  /* { path: "/help", component: Help },
  { path: "/messages", component: Messages },
  { path: "/payment", component: PaymentInfo },
  { path: "/settings", component: Settings }, */
  { path: '/appoinments', component: AppointmentsPage },
  { path: '/business-info', component: BusinessInfo },
  { path: '/business-info-details', component: BusinessInfoDetails },
];

let currentUser = 'business';
let currentPage = 'business-home';

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
        <Router>
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

        {currentUser === 'business' && (
          <div>
            {currentPage === 'business-home' && (
              <BusinessHome />
            )}
            {currentPage === 'business-info' && (
              <BusinessInfo />
            )}
          </div>
        )}

        {currentUser === 'customer' && (
          <AppointmentsPage />
        )}

      </ThemeProvider>
    </div>
  );
};

export default App;
