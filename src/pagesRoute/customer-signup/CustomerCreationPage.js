import React, {useState} from 'react'
import logo from '../../images/avatar.jpg'
import {ClickAwayListener, TextField} from '@material-ui/core/'
import './customerSignup.css'


function CustomerCreationPage(){
    return(
<div ClassName="main">
        <div ClassName="page-items"> 
            <h2>Name</h2>
            <TextField/>    
        </div>

        <div ClassName="page-items"> 
            <h2>Phone Number</h2>
            <TextField/>
            <a>Not now</a>    
        </div>

        <div ClassName="page-items"> 
            <h2>Email Address</h2>
            <TextField/>    
        </div>


        <div ClassName="page-items"> 
            <h2>Address/Location</h2>
            <TextField/>    
        </div>
</div>
    )
}

export default CustomerCreationPage;