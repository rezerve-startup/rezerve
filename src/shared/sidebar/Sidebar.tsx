import {
  Typography,
  Divider,
  IconButton,
  makeStyles,
  SwipeableDrawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  MenuItem,
  Menu,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Badge
} from '@material-ui/core';
import {
  AccountCircle, ArrowDropDown, Business, CalendarViewDay, Close, ExitToApp, Forum, Help, Home, Menu as MenuIcon, Search
} from '@material-ui/icons';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { auth } from '../../config/FirebaseConfig';
import { setEmployeeEmail, setEmployeePhone } from '../store/actions';
import { StoreState } from '../store/types';

function mapStateToProps(state: StoreState) {
  return ({
    user: state.system.user
  })
}

const Sidebar = (props: any ) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileSidebar, setMobileSidebar] = React.useState({
    isSidebarOpen: false,
  });

  const [userName, setUserName] = React.useState(`${props.user.firstName} ${props.user.lastName}`);
  const [emailAddress, setEmailAddress] = React.useState(props.user.email);
  const [phoneNumber, setPhoneNumber] = React.useState(props.user.phone);
  const [open, setProfileOpen] = React.useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const sidebarDataWithoutLogout = [
    {
      title: 'Messages',
      path: '/messages',
      icon: <Forum />,
      cName: 'nav-text',
    },
    {
      title: 'Business Search',
      path: '/customer-home',
      icon: <Search />,
      cName: 'nav-text',
    },
    {
      title: 'Employee Home',
      reference: props.employeeNotifications,
      path: '/employee-home',
      icon: <Home />,
      cName: 'nav-text'
    },
    {
      title: 'Business Home',
      reference: props.businessNotifications,
      path: '/business-home',
      icon: <Business />,
      cName: 'nav-text',
    },
    {
      title: 'Appointments',
      reference: props.employeeNotifications,
      path: '/appointments',
      icon: <CalendarViewDay />,
      cName: 'nav-text',
    },
  ];

  const handleMobileSidebar = (value: boolean) => (
    _event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    setMobileSidebar({ ...mobileSidebar, isSidebarOpen: value });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openOnClick = () => {
    setProfileOpen(true);
  };

  const handleClose = () => {
    setProfileOpen(false);
    handleMenuClose()
  };

  function logoutUser() {
    auth.signOut();
  }

  if (props.user === undefined) {
    return (
      <Redirect to={'/'} />
    )
  } else {
    const menuId = 'primary-desktop-dropdown-menu';
    const renderDropdownMenuDesktop = (
      <Menu
        id={menuId}
        classes={{ paper: classes.menu }}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        keepMounted={true}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        {props.user.customerId === '' &&
          <MenuItem button={true} component={Link} to={sidebarDataWithoutLogout[2].path}>
            <ListItemIcon className={classes.listIcon}><Badge color="primary" badgeContent={props.employeeNotifications}>{sidebarDataWithoutLogout[2].icon}</Badge></ListItemIcon>
            <ListItemText className={classes.listText} primary={sidebarDataWithoutLogout[2].title} />
          </MenuItem>
        }
        {props.user.customerId === '' && props.user.employeeInfo.isOwner === true &&
          <MenuItem button={true} component={Link} to={sidebarDataWithoutLogout[3].path}>
            <ListItemIcon className={classes.listIcon}><Badge color="primary" badgeContent={props.businessNotifications}>{sidebarDataWithoutLogout[2].icon}</Badge></ListItemIcon>
            <ListItemText className={classes.listText} primary={sidebarDataWithoutLogout[3].title} />
          </MenuItem>
        }
        {props.user.employeeId === '' &&
          <MenuItem button={true} component={Link} to={sidebarDataWithoutLogout[4].path}>
            <ListItemIcon className={classes.listIcon}><Badge color="primary" badgeContent={props.employeeNotifications}>{sidebarDataWithoutLogout[4].icon}</Badge></ListItemIcon>
            <ListItemText className={classes.listText} primary={sidebarDataWithoutLogout[4].title} />
          </MenuItem>
        }
        {sidebarDataWithoutLogout.slice(5).map((obj, i) => (
          <MenuItem button={true} key={i} component={Link} to={obj.path}>
            <ListItemIcon className={classes.listIcon}>{obj.icon}</ListItemIcon>
            <ListItemText className={classes.listText} primary={obj.title} />
          </MenuItem>
        ))}
        <MenuItem onClick={openOnClick}>
          <ListItemIcon className={classes.listIcon}>{<Help/>}</ListItemIcon>
          <ListItemText className={classes.listText} primary="Help"/>
        </MenuItem>
        <ListItem button={true} onClick={() => logoutUser()}>
          <ListItemIcon className={classes.listIcon}>{<ExitToApp />}</ListItemIcon>
          <ListItemText className={classes.listText} primary={'Logout'} />
        </ListItem>
      </Menu>
    );

    const mobileMenuId = 'primary-mobile-sidebar-menu';
    const renderMobileSidebar = (
      <SwipeableDrawer
        anchor="left"
        id={mobileMenuId}
        open={mobileSidebar.isSidebarOpen}
        onClose={handleMobileSidebar(false)}
        onOpen={handleMobileSidebar(true)}
        classes={{ paper: classes.sidebar }}
      >
        <div className={classes.list} role="presentation">
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar src="../../assets/avatar.jpg" />
              </ListItemAvatar>
              <ListItemText className={classes.listText} primary={`${props.user.firstName} ${props.user.lastName}`} />
            </ListItem>
            <Divider className={classes.divider} />
            {sidebarDataWithoutLogout.map((obj, i) => {
                if (!(props.user.customerId === '')) {
                  if (!(obj.title === 'Business Home' || obj.title === 'Employee Home')) {
                    return (
                        <ListItem button={true} key={i} component={Link} to={obj.path}>
                            <ListItemIcon className={classes.listIcon}>
                              <Badge color="primary" badgeContent={obj.reference}>{obj.icon}</Badge>
                            </ListItemIcon>
                            <ListItemText className={classes.listText} primary={obj.title} />
                        </ListItem>
                    )
                  }
                } else if (!(props.user.employeeId === '')) {
                  if (!(obj.title === 'Appointments' || obj.title === 'Business Search' || 
                  (obj.title === 'Business Home' && props.user.employeeInfo.isOwner === false ))) {
                    return (
                      <ListItem button={true} key={i} component={Link} to={obj.path}>
                          <ListItemIcon className={classes.listIcon}>
                            <Badge color="primary" badgeContent={obj.reference}>
                            {obj.icon}
                            </Badge>
                          </ListItemIcon>
                          <ListItemText className={classes.listText} primary={obj.title} />
                      </ListItem>
                    )
                  }
                }
            })}
            <MenuItem onClick={openOnClick}>
            <ListItemIcon className={classes.listIcon}>{<Help/>}</ListItemIcon>
            <ListItemText className={classes.listText} primary="Help"/>
          </MenuItem>
            <ListItem button={true} onClick={() => logoutUser()}>
              <ListItemIcon className={classes.listIcon}>{<ExitToApp />}</ListItemIcon>
              <ListItemText className={classes.listText} primary={'Logout'} />
            </ListItem>
          </List>
        </div>z
      </SwipeableDrawer>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <div className={classes.sectionMobile}>
              <IconButton
                edge="start"
                aria-label="menu"
                className={classes.menuButton}
                onClick={handleMobileSidebar(true)}
              >
                <Badge color="primary" badgeContent={props.businessNotifications + props.employeeNotifications}>
                  <MenuIcon />
                </Badge>
              </IconButton>
            </div>
            <Typography
              className={classes.title}
              variant="h6"
              noWrap={true}
              color="primary"
              component={Link}
              to="/"
            >
              ReZerve
            </Typography>
            <div className={classes.root} />
            <div className={classes.sectionDesktop}>
              <Box display="flex">
                <Button
                  className={classes.toolbarButton}
                  startIcon={<Forum />}
                  component={Link}
                  to="/messages"
                  classes={{ text: classes.toolbarButtonText }}
                >
                  Messages
                </Button>
                {props.user.customerId !== '' && 
                    <div>
                        <Button
                            className={classes.toolbarButton}
                            startIcon={<Search />}
                            component={Link}
                            to="/customer-home"
                            classes={{ text: classes.toolbarButtonText }}
                        >
                        Business Search
                        </Button>
                        <Button
                            className={classes.toolbarButton}
                            startIcon={<CalendarViewDay />}
                            component={Link}
                            to="/appointments"
                            classes={{ text: classes.toolbarButtonText }}
                        >
                        Appointments
                        </Button>
                    </div>
                }
                <Button
                  className={classes.toolbarButton}
                  aria-label="user-account"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  startIcon={<Badge color="primary" badgeContent={props.businessNotifications + props.employeeNotifications}><AccountCircle /></Badge>}
                  endIcon={<ArrowDropDown />}
                >
                  {props.user.firstName} {props.user.lastName}
                </Button>
              </Box>
            </div>
          </Toolbar>
        </AppBar>
        {renderDropdownMenuDesktop}
        {renderMobileSidebar}

        <Dialog
          open={open}
          fullScreen={false}
          className={classes.dialog}
        >
          <DialogContent className={classes.profilePage}>
            {/* <Divider className={classes.Divider}/> */}
          <DialogActions >
          <Typography style={{fontSize: "30pt", left: "20px", position: "absolute"}} variant="h3" align="left">
                  Help   
              </Typography>
              <Close className={classes.close} onClick={handleClose} fontSize="large"/>
          </DialogActions>
            <div>
              

              <Divider className={classes.Divider}/>

              <Typography variant="subtitle1" align="center"> 
                <p>
                  Thank you for all your support and cooperation as we 
                  continue to expand and develop our product in creating
                  an improved experience between stylists and their customers. <br/><br/>

                  Reliability is our top priority, and we value any opportunity to assist
                  our users with any issues surrounding ReZerve.<br/><br/>
                  For any support inquiries, please email: <br/>
                  <a href="mailto: rezerve.help@gmail.com" style={{color: "#3087de", fontWeight: "bold"}}>rezerve.help@gmail.com</a>
                </p> 
              </Typography>
            </div>
        </DialogContent>
      </Dialog>
      </div>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: theme.palette.secondary.dark,
    height: '10hv'
  },
  sidebar: {
    backgroundColor: theme.palette.secondary.dark,
  },
  menu: {
    backgroundColor: theme.palette.secondary.main,
  },
  toolbarButton: {
    color: theme.palette.common.white,
    borderRadius: '5em',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
  },
  toolbarButtonText: {
    padding: '6px 10px',
  },
  title: {
    display: 'block',
    color: theme.palette.background.paper,
    textDecoration: 'none',
  },
  divider: {
    background: 'white',
    color: 'white',
    height: '2px',
    marginTop: '2px',
    marginBottom: '2px',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: theme.palette.background.paper,
  },
  list: {
    width: 250,
  },
  listIcon: {
    color: 'white',
  },
  listText: {
    color: 'white',
    fontSize: '25px',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  close: {
    color: theme.palette.primary.light,
    fontSize: '30pt',
    '&:hover': {
      color: theme.palette.primary.main,
      cursor: "pointer"
    },
  },

  image: {
    // Theme Color, or use css color in quote,
    height: '100px',
    width: '100px',
    margin: 'auto',
  },

  dialog: {
    height: '100vh',
    width: '100vw',
    color: 'black',
    textAlign: 'center',
    alignItems: 'center',
    position: 'fixed',
  },

  profilePage: {
    background: '#353535',
    color: 'white'
  },

  edit: {
    color: '#ff4a4b',
    cursor: 'pointer'
  },

  Divider: {
    background: '#353535',
    height: '50px'
  },

  label: {
    textAlign: 'left',
    display: 'flex',
    width: '300px'
  },
  dataInput: {
    textAlign: 'left',
    display: 'flex',
    color: 'white'
  },
}));

export default connect(mapStateToProps, { setEmployeePhone, setEmployeeEmail })(
  Sidebar
);