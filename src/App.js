import React, { useState } from 'react';
import Sidebar from './sidebar'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
import './sidebar.css'
import Help from './pagesRoute/Help'
import Messages from './pagesRoute/Messages'
import PaymentInfo from './pagesRoute/PaymentInfo'
import Settings from './pagesRoute/Settings'
import AppointmentsPage from './pagesRoute/appointments/AppointmentsPage'
import Services from './services/Services';

function App() {

  return (
    <>
      <Router>
      
        <Switch>
          <Route path="/help" exact component={ Help }/>
          <Route path="/messages" exact component={ Messages }/>
          <Route path="/payment" exact component={ PaymentInfo }/>
          <Route path="/settings" exact component={ Settings }/>
          <Route path="/appointments" exact component={ AppointmentsPage }/>
          <Route path="/services" exact component={ Services }/>
        </Switch>
      </Router>
    </>
  );

}

export default App;
