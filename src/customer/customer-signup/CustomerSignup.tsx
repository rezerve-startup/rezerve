import React from 'react';
 import { Checkbox, FormGroup } from '@material-ui/core'
import './customerSignup.css';

function CustomerSignup() {
  return (
    <div className="main">
      { <form>
        <div className="page-items"> 
                    
                <div className='inputText row col-11 offset-1 offset-sm-1'>
                        <h1><strong>Account Info</strong></h1>    
                </div>
       
        <FormGroup row>
                        <div className="inputText row col-11 offset-1 offset-sm-1" >
                            <label>Name</label>
                            <input type="text" name="name"  
                                id="name"></input>
                        </div>
        </FormGroup>

        
        <FormGroup row>
                        <div className="inputText row col-11 offset-1 offset-sm-1" >
                            <label>Phone Number</label>
                            <input type="text" name="phone-number"  
                                id="phone-number"></input>
                        </div>
        </FormGroup> 
        
        </div>
        
        <div className="checkbox">
            <Checkbox/>
            <span>Not Now</span>
        </div>

        <div className="page-items"> 
        <FormGroup row>
                        <div className="inputText row col-11 offset-1 offset-sm-1" >
                            <label>Email Address</label>
                            <input type="text" name="email-address"  
                                id="email-address"></input>
                        </div>
        </FormGroup>  
        


        
        <FormGroup row>
                        <div className="inputText row col-11 offset-1 offset-sm-1" >
                            <label>Address/Location</label>
                            <input type="text" name="location"  
                                id="location"></input>
                        </div>
        </FormGroup>   
        </div>

        <div>
            <button className="button">Find Stylists & Book</button>
        </div>
        </form> }
    </div>
  );
}

export default CustomerSignup;
