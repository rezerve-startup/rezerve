import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
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
  Dialog,
  DialogContent,
} from '@material-ui/core';
import {
  AccountCircle,
  Menu as MenuIcon,
  Forum,
  CalendarViewDay,
  Help,
  Settings,
  ExitToApp,
  ArrowDropDown,
  Search,
} from '@material-ui/icons';
import { connect } from 'react-redux';
import { StoreState } from '../store/types';
import { logoutUser } from '../store/actions';
import { auth } from '../../config/FirebaseConfig';
import MessagingHome from '../messaging/MessagingHome';

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
    title: 'Appointments',
    path: '/appointments',
    icon: <CalendarViewDay />,
    cName: 'nav-text',
  },
  {
    title: 'Help',
    path: '/help',
    icon: <Help />,
    cName: 'nav-text',
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <Settings />,
    cName: 'nav-text',
  },
];

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

  const isMenuOpen = Boolean(anchorEl);

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

  const dispatchLogoutUser = () => {
    props.logoutUser();
  }

  function logoutUser() {
    auth.signOut().then(() => {
      dispatchLogoutUser();
    })
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
        {sidebarDataWithoutLogout.slice(3).map((obj, i) => (
          <MenuItem button={true} key={i} component={Link} to={obj.path}>
            <ListItemIcon className={classes.listIcon}>{obj.icon}</ListItemIcon>
            <ListItemText className={classes.listText} primary={obj.title} />
          </MenuItem>
        ))}
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
                if (!(props.user.customerId === '') || !(obj.title === 'Appointments' || obj.title === 'Business Search')) {
                    return (
                        <ListItem button={true} key={i} component={Link} to={obj.path}>
                            <ListItemIcon className={classes.listIcon}>
                            {obj.icon}
                            </ListItemIcon>
                            <ListItemText className={classes.listText} primary={obj.title} />
                        </ListItem>
                    )
                }
            })}
            <ListItem button={true} onClick={() => logoutUser()}>
              <ListItemIcon className={classes.listIcon}>{<ExitToApp />}</ListItemIcon>
              <ListItemText className={classes.listText} primary={'Logout'} />
            </ListItem>
          </List>
        </div>
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
                <MenuIcon />
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
                  startIcon={<AccountCircle />}
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
    height: '7.5vh'
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
}));

export default connect(mapStateToProps, { logoutUser })(
  Sidebar
);
