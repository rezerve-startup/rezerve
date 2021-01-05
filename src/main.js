import React from 'react';
import SignUpPage1 from './SignUpPage';
import BusinessSignUp from './BusinSignUp';
import BusinessAccountInfo from './BusinAccInfo';

import CustomerSignup from './CustomerSignup'
import { BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

function Main(state) {
  return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/BusinSignUp' component={BusinessSignUp}/>
                <Route exact path='/home' component={SignUpPage1}/>
                <Route exact path="/BusinActInfo" component={BusinessAccountInfo}/>
                <Route exact path="/CustomSignUp" component={CustomerSignup}/>
                <Redirect to="/home"/>
            </Switch>
        </BrowserRouter>
  );
}

export default Main;
