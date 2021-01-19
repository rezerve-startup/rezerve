import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import basiclink from './basiclink'
import './App.css';
import CustomerCreationPage from './pagesRoute/customer-signup/CustomerCreationPage';


function App() {

  return (
    <>
      <basiclink/>
      
      <Router>
 
        <Switch>
          <Route path="/customer-signup" exact component={ CustomerCreationPage }/>
        </Switch>
        
      </Router>
      
    </>
  );

}

export default App;
