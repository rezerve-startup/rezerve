import React, { useState } from 'react';
import Sidebar from './sidebar'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
import Help from './pagesRoute/Help'
import Messages from './pagesRoute/Messages'
import PaymentInfo from './pagesRoute/payments/PaymentInfo'
import Settings from './pagesRoute/Settings'
import AppointmentsPage from './pagesRoute/appointments/AppointmentsPage'

function App() {

  return (
    <>
      <Router>
        <Sidebar class="sidebar" />
        <Switch class="content-screen">
          <Route path="/help" exact component={ Help }/>
          <Route path="/messages" exact component={ Messages }/>
          <Route path="/payment" exact component={ PaymentInfo }/>
          <Route path="/settings" exact component={ Settings }/>
          <Route path="/appointments" exact component={ AppointmentsPage }/>
          <Route path="/success.html" />
          <Route path="/canceled.html" />
        </Switch>
      </Router>
    </>
  );

}

export default App;
