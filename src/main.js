import React from 'react';
import SignUpPage1 from './SignUpPage';
import BusinessSignUp from './BusinSignUp';
import BusinessAccountInfo from './BusinAccInfo';
import { BrowserRouter, Switch, Route, Redirect, Header, Footer} from 'react-router-dom';

function Main(state) {
  return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/SignUpPage2' component={BusinessSignUp}/>
                <Route exact path='/home' component={SignUpPage1}/>
                <Route exact path="/BusinActInfo" component={BusinessAccountInfo}/>
                <Redirect to="/home"/>
            </Switch>
        </BrowserRouter>
  );
}

export default Main;
