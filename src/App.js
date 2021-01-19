import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Sidebar from './sidebar'
import './App.css';
import './sidebar.css'
import BusinessTabs from "./pagesRoute/business-home/BusinessTabs"

import Help from './pagesRoute/Help'
import Messages from './pagesRoute/Messages'
import PaymentInfo from './pagesRoute/PaymentInfo'
import Settings from './pagesRoute/Settings'
import AppointmentsPage from './pagesRoute/appointments/AppointmentsPage'
import BusinessInfo from './pagesRoute/business-info/BusinessInfo';

const routes = [
  { path: "/help", component: Help },
  { path: "/messages", component: Messages },
  { path: "/payment", component: PaymentInfo },
  { path: "/settings", component: Settings },
  { path: "/appoinments", component: AppointmentsPage }
]

const useStyles = makeStyles({
  root: {
    flex: 1,
    height: '80vh'
  }
})

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FE8488",
      light: "#FF6D6D",
      dark: "#FF2B2B"
    },
    secondary: {
      main: "#5B5B5B",
      light: "#D7D7D7",
      dark: "#353535"
    }
  }
})

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <Router>
          <Sidebar />
          <BusinessInfo />
          {/* <Switch>
            {routes.map((route, i) => (
              <Route key={i} path={route.path} exact component={route.component} />
            ))}
          </Switch> */}
        </Router>
        {/* <BusinessTabs /> */}
      </ThemeProvider>
    </div>
  );
}

export default App;