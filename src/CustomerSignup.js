import React, {useState} from 'react'
import {ClickAwayListener, TextField, Checkbox, makeStyles} from 'material-ui-core'
import { FormCheck, FormControl, FormLabel } from 'react-bootstrap';
import {Form, FormGroup} from 'reactstrap';
import {Link} from 'react-router-dom';
import './CSS/CustomerSignUp.css'


function CustomerSignup(){
    
    return(
<div class="main">
       <Form>
        <div class="page-items"> 
                    
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
        
        <div class="checkbox">
            <Checkbox/>
            <span>Not Now</span>
        </div>

        <div class="page-items"> 
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
            <button class="button">Find Stylists & Book</button>
        </div>
        </Form>
</div>
    )
}

export default CustomerSignup;