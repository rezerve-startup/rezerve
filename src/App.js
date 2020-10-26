import React from 'react';
import Sidebar from './sidebar'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
import Help from './pagesRoute/Help'
import Messages from './pagesRoute/Messages'
import PaymentInfo from './pagesRoute/PaymentInfo'
import Settings from './pagesRoute/Settings'
import YouAppointment from './pagesRoute/YouAppointment'

function App() {
  return (
    <>
      <Router>
        <Sidebar />
        <Switch>
          <Route path="/help" exact component={ Help }/>
          <Route path="/messages" exact component={ Messages }/>
          <Route path="/payment" exact component={ PaymentInfo }/>
          <Route path="/settings" exact component={ Settings }/>
          <Route path="/appointments" exact component={ YouAppointment }/>
        </Switch>
      </Router>
    </>
  );
}

export default App;
