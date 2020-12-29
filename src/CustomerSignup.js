import React, {useState} from 'react'
import {ClickAwayListener, TextField, Checkbox, makeStyles} from 'material-ui-core'
import './CSS/CustomerSignUp.css'

const makeSdtyles = theme => ( {
    root: {
      background: "black"
    },
    input: {
      color: "white"
    }
  });

function CustomerSignup(){
    
    return(
<div class="main">
       
        <div class="page-items"> 
                    <h1>Account Info</h1>    
        </div>
       
        <div class="page-items"> 
            <h2>Name</h2>
            <TextField color="secondary" fullWidth/>    
        </div>

        <div class="page-items"> 
            <h2>Phone Number</h2>
            <TextField color="secondary" fullWidth/>   
        </div>

        <div class="checkbox">
            <Checkbox/>
            <span>Not Now</span>
        </div>

        <div class="page-items"> 
            <h2>Email Address</h2>
            <TextField color="secondary" fullWidth/>    
        </div>


        <div class="page-items"> 
            <h2>Address/Location</h2>
            <TextField color="secondary"  fullWidth/>    
        </div>

        <div>
            <button class="button">Find Stylists & Book</button>
        </div>
</div>
    )
}

export default CustomerSignup;