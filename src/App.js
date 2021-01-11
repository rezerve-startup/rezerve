import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from './sidebar'
import './App.css';
import './sidebar.css'
import BusinessTabs from "./pagesRoute/business-home/BusinessTabs"

import Help from './pagesRoute/Help'
import Messages from './pagesRoute/Messages'
import PaymentInfo from './pagesRoute/PaymentInfo'
import Settings from './pagesRoute/Settings'
import AppointmentsPage from './pagesRoute/appointments/AppointmentsPage'

const routes = [
  { path: "/help", component: Help },
  { path: "/messages", component: Messages },
  { path: "/payment", component: PaymentInfo },
  { path: "/settings", component: Settings },
  { path: "/appoinments", component: AppointmentsPage }
]

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  }
}))

export default function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Router>
        <Sidebar />
        <Switch>
          {routes.map((route, i) => (
            <Route key={i} path={route.path} exact component={route.component} />
          ))}
        </Switch>
      </Router>
      <BusinessTabs />
    </div>
  );
}