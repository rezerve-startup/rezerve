import React from 'react';
import BusinessSignUp from './BusinSignUp';
import BusinessAccountInfo from './BusinAccInfo';
import { BrowserRouter, Switch, Route, Redirect, Header, Footer} from 'react-router-dom';

function Main(state) {
  return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/home' component={BusinessSignUp}/>
                <Route exact path="/BusinActInfo" component={BusinessAccountInfo}/>
                <Redirect to="/home"/>
            </Switch>
        </BrowserRouter>
  );
}

export default Main;
