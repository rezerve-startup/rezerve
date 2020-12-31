import React, { useState } from 'react';
import {Form, FormGroup} from 'reactstrap';
import {Link} from 'react-router-dom';
import './CSS/BusinSignUp.css';
import './CSS/Signup.css';

function SignUpPage1(props) {

    const [state,setState] = useState({
            Customer: false,
            Business: false,

    });  


    return(
        <div className='signUp-page'>
            <div className='container' /*id="SignUpPage"*/>
                <Form /*onSubmit={handleSubmit}*/>
                    <div className="row col col-11 col-md-auto offset-1 offset-sm-0">
                        <h1>Sign&nbsp;Up</h1>
                    </div>
                   <FormGroup row>
                        <div className="row col-10 offset-2 offset-sm-3" >
                            <label>Customer</label>
                        </div>
                    </FormGroup> 
                    <FormGroup row>
                        <div className="row col-10 offset-2 offset-sm-3" >
                              <Link to = "/BusinSignUp">
                                  <label className="labelContainer" >         
                           
                             Business
                            
                                </label>
                                </Link>
                        </div>
                    </FormGroup>
                    
				
                </Form>
            </div>
        </div>
    );
}

export default SignUpPage1;