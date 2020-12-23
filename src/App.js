import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';


function App() {

  return (
    <>
      <Router>
        <Sidebar />
        <Switch>
          <Route path="/help" exact component={ Help }/>
        </Switch>
      </Router>
    </>
  );

}

export default App;
