import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
import {CustomerCreationPage} from './pagesRoute/CustomerCreationPage';


function App() {

  return (
    <>
      <Router>
    
        <Switch>
          <Route path="/customer-signup" exact component={ CustomerCreationPage }/>
        </Switch>
      </Router>
      <Link to="/customer-signup"><a>Customer Signup</a></Link>
    </>
  );

}

export default App;
