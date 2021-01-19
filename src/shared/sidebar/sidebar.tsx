import React, { useState } from 'react';
import './sidebar.css';
// import { sidebarData } from './sidebarData'
// import * as FaIcons from '../../customer/user-reciept/node_modules/react-icons/fa'
// import { Link } from 'react-router-dom'
// import { IconContext } from 'react-icons'
// import {Typography, Divider, ClickAwayListener} from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles';
// import logo from '../../assets/avatar.jpg'

function Sidebar() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const toggleOff = () => {
    if (sidebar === true) {
      showSidebar();
    }
  };
  const useStyles = makeStyles({
    divider: {
      // Theme Color, or use css color in quote
      background: 'white',
      color: 'white',
      height: '4px',
    },
  });
  const classes = useStyles();

  return (
    // <ClickAwayListener onClickAway={toggleOff}>
    <div className="Sidebar">
      {/* <IconContext.Provider value={{ color : '#fff' }}>

        <div className='navbar'>
            <Link to="#" className='menu-bars'>
                <FaIcons.FaBars onClick={showSidebar} className="hamburgerIcon"/>
            </Link>
            <Typography variant="h4" component="h2">
                <a href="/" className="homeAnchor">
                    <span  className="rezerve-head">
                        ReZerve
                    </span>
                </a>
            </Typography>
            <Link to="#" classname='menu-bars'>
                <FaIcons.FaBars onClick={showSidebar} className="hamburgerIcon"/>
            </Link>

        </div>
        
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
           
            <ul className='nav-menu-items' >
            
                <li className='navbar-toggle'>
                <Link to="/profilePage" onClick={toggleOff}>
                <img src={logo} alt="Logo" className='image-cropper'/>
                    </Link>
                    <span className='user-heading'><strong>John Barber</strong>
                        </span>

                    
                </li>
               <Divider variant="middle" className={classes.divider}/>
                
                {sidebarData.map((item, index) => {
                    return (
                        <li key={index} className={item.cName}  onClick={showSidebar}>
                           <Link to={item.path}>
                                {item.icon}
                                <span style={{ marginLeft: '16px' }}>{item.title}</span>   
                            </Link> 
                        </li>
                    )
                })}
                
            </ul>
            
        </nav>
    
        </IconContext.Provider> */}
    </div>
    // </ClickAwayListener>
  );
}

export default Sidebar;
