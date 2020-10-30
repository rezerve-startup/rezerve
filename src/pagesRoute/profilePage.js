import React from 'react'
import logo from '../images/avatar.jpg'
import {Divider, TextField} from '@material-ui/core/'
import '../user-profile.css'


function profilePage() {
    const infoList = [
        {
            stat : "Username",
            current: "jbarber9000",
            id: "filled-required"
        },
        {
            stat : "Phone Number",
            current: "479555555",
            id: "standard-number"
        },
        {
            stat : "Email Address",
            current: "j.barb42@gmail.com",
            id: "filled-required"
        }

    ];
    
    
    
    
    return (
        
       
        <div >
           <div className="page_layout">
           <h1>Edit Account</h1>
           </div>

           <div className="page_layout">
           
           <img src={logo} className="image"/> 
           </div>

           <div className="page_layout">
            <a href="#">Change</a>
            </div>

            <div className="item_layout">
            
            {infoList.map((item, index) => {
                    return (
                        <div className="item_layout">
                        <h2 key={index}>{item.stat}</h2>
                        <TextField required id={item.id} defaultValue={item.current} />
                        
                        </div>
                    )
                })}
            </div>
        </div>

        
  
        
        
        
      
    )
}

export default profilePage