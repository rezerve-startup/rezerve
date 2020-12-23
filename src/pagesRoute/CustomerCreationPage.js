import React, {useState} from 'react'
import logo from '../../images/avatar.jpg'
import {ClickAwayListener, TextField} from '@material-ui/core/'


function CustomerCreationPage(){
    return(
<div>
        <div> 
            <h2>Name</h2>
            <TextField/>    
        </div>

        <div> 
            <h2>Phone Number</h2>
            <TextField/>
            <a>Not now</a>    
        </div>

        <div> 
            <h2>Email Address</h2>
            <TextField/>    
        </div>


        <div> 
            <h2>Address/Location</h2>
            <TextField/>    
        </div>
</div>
    )
}

export default CustomerCreationPage;