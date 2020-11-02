import React, {useState} from 'react'
import logo from '../images/avatar.jpg'
import {ClickAwayListener, TextField} from '@material-ui/core/'
import '../user-profile.css'


function ProfilePage() {
    
    const [nav, setNav] = useState(false)
    const showNav = () => setNav(!nav);
    const togglePW = () => {
        if(nav == true){
            showNav(false);
        }
    };
    const infoList = [
        {
            stat : "Username",
            current: "jbarber9000"
        },
        {
            stat : "Phone Number",
            current: "479555555"
        },
        {
            stat : "Email Address",
            current: "j.barb42@gmail.com"
        }

    ];
    
    
    
    
    return (
        
        <ClickAwayListener onClickAway={togglePW}> 
        <div>
           <div  className="page_layout">
           <h1>Edit Account</h1>
           

           
           
           <img src={logo} className="image"/> 
           
            <a href="#">Change</a>
            

            
            </div>
            {infoList.map((item, index) => {
                    return (
                        <div className="item_layout">
                        <h2 key={index}>{item.stat}</h2>
                        <span/>
                        <TextField required id={item.stat} defaultValue={item.current} />
                        
                        </div>
                    )
                })
                } 
                
            
            <div className="page_layout">
                <a href="#" onClick={showNav}>Change Password?</a>
                </div>

                <div className="item_layout">
            <button className="button">Save Changes</button>
            </div>
               
            <nav className={nav ? 'pw-menu active' : 'pw-menu'}>
                <div className="item_layout">
                    <h1>Password Change Request</h1> 
                    
                </div>
               
                <div className="item_layout">
                <h3>Current Password:  </h3> <span/>
                <TextField className="textfield" id="current-password" type="password" />
                </div>

                <div className="item_layout">
                <h3>Confirm Password:  </h3> <span/>
                <TextField className="textfield" id="current-password" type="password" />
                </div>
              
              <div className="item_layout">
                  <span>Upon request, an email will be sent confirming the password change.</span>
              </div>
            
            <div className="item_layout">
                <button className="button" onClick={togglePW}>Confirm Request</button>
            </div>
            </nav>
            
        </div>
        </ClickAwayListener>
        
  
        
        
        
      
    )
    
}

export default ProfilePage