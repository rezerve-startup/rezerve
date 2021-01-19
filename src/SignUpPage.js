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
            <Form /*onSubmit={handleSubmit}*/>
                 <div className='container'>
              
                    <div className="row col col-11 col-md-auto offset-1 offset-sm-1">
                        <h1><strong>Sign&nbsp;Up</strong></h1>
                    </div>
                
                   <FormGroup row>
                   <Link to = "/CustomSignUp">
                        <div className="inputText row col-10 offset-2 offset-sm-0" >
                            <label className ="labelContainer">
                            <button class="button button1">Customer</button>
                                </label>
                        </div>
                        </Link>
                    </FormGroup> 
                    <FormGroup row>
                      <Link to = "/BusinSignUp">
                          <div className="inputText row col-10 offset-2 offset-sm-6" >
                              
                                  <label  className ="labelContainer">         
                           
                                  <button class="button button1">Business</button>
                            
                                </label>
                                
                        </div>
                        </Link>
                    </FormGroup>
                    
                 
               
            </div>  
             </Form>
        </div>
    );
}

export default SignUpPage1;