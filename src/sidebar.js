import React, {useState} from 'react';
import './sidebar.css'
import { sidebarData } from './sidebarData' 
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { IconContext } from 'react-icons'
import {Typography, Divider, ClickAwayListener} from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import logo from './images/avatar.jpg'




function Sidebar() {
  


    const [sidebar, setSidebar] = useState(false)
    const showSidebar = () => setSidebar(!sidebar)
    var isOn = false;
    const toggleOn = () => {
        setSidebar(true);
        isOn = true;
    };
    
    const toggleOff = () => {
        if(isOn){
        setSidebar(false);}
    };
    const useStyles = makeStyles((theme) => ({
        divider: {
            // Theme Color, or use css color in quote
            background: 'white',
            color: 'white',
        },
      }));
      const classes = useStyles();
      
    


    
    return(
        
        <>
        <ClickAwayListener onClickAway={toggleOff}>
        <IconContext.Provider value={{ color : '#fff' }}>

        
        
        
        <div className='navbar'>

            <Link to="#" classname='menu-bars'>
                <FaIcons.FaBars onClick={showSidebar} className="hamburgerIcon"/>
            </Link>
            <Typography variant="h4" component="h2">
                <span  className="rezerve-head">
                    Rezerve
                </span>
            </Typography>
        </div>
        
        
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
           
            <ul className='nav-menu-items' >
            
                <li className='navbar-toggle'>
                <img src={logo} alt="Logo" className='image-cropper'/>
                    <h1 className='user-heading'>
                        John Barber</h1>
                </li>
               <Divider variant="middle" className={classes.divider}/>
                
                {sidebarData.map((item, index) => {
                    return (
                        <li key={index} className={item.cName}  onClick={toggleOff}>
                           <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>   
                            </Link> 
                        </li>
                    )
                })}
                
            </ul>
            
        </nav>
        
        </IconContext.Provider>
        </ClickAwayListener>
       </> 
       
    );

}

export default Sidebar;
