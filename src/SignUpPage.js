import React, { useState } from 'react';
import {Form, FormGroup} from 'reactstrap';
import {Link} from 'react-router-dom';
import './CSS/BusinSignUp.css';

function SignUpPage1(props) {

    const [state,setState] = useState({
            Customer: false,
            Business: false,

    });  

   
		
    const handleSubmit = event =>{
        console.log("Current State is" + JSON.stringify(state))
        event.preventDefault();
    }



    return(
        <div className='signUp-page'>
            <div className='container' id="SignUpPage">
                <Form onSubmit={handleSubmit}>
                    <div className="row col col-11 col-md-auto offset-1 offset-sm-0">
                        <h1>Sign Up</h1>
                    </div>
                    
						<FormGroup row>
                        <div className="Next row col-11 offset-1 offset-sm-0">
                            <Link to="/BusinSignUp">
                                <button type="submit" className="btn btn-danger">
                                    NEXT
                                </button>
                            </Link>
                        </div>
                    </FormGroup>

                </Form>
            </div>
        </div>
    );
}

export default SignUpPage1;