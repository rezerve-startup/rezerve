import React, {useState} from 'react';
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { sidebarData } from './sidebarData' 
import './sidebar.css'
import { IconContext } from 'react-icons'
import {Typography, Divider} from '@material-ui/core/'
import './images/avatar.jpg'
import { Dropdown } from 'react-bootstrap';

function Sidebar() {
  


    const [sidebar, setSidebar] = useState(false)
    const showSidebar = () => setSidebar(!sidebar)

    return (
        <>
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
                <img src='avatar.jpg' className='image-cropper'/>
                    <h1 className='user-heading'>
                        John Barber</h1>
                    <Link to='#' className='menu-bars' onClick={showSidebar}>
                        <AiIcons.AiOutlineClose />
                    </Link>
                </li>
                <Dropdown.Divider />
                {sidebarData.map((item, index) => {
                    return (
                        <li key={index} className={item.cName}>
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
        </>
    );

}

export default Sidebar;
