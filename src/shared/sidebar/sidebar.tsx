import React from 'react';
import { sidebarData } from './sidebarData';
import { Link } from 'react-router-dom';
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
} from '@material-ui/core';
import {
  AccountCircle,
  Menu as MenuIcon,
  Forum,
  CalendarViewDay,
  ArrowDropDown,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: theme.palette.secondary.dark,
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

function Sidebar() {
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

  const menuId = 'primary-desktop-dropdown-menu';
  const renderMenu = (
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
      {sidebarData.slice(2).map((obj, i) => (
        <MenuItem button={true} key={i} component={Link} to={obj.path}>
          <ListItemIcon className={classes.listIcon}>{obj.icon}</ListItemIcon>
          <ListItemText className={classes.listText} primary={obj.title} />
        </MenuItem>
      ))}
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
            <ListItemText className={classes.listText} primary="John Barber" />
          </ListItem>
          <Divider className={classes.divider} />
          {sidebarData.map((obj, i) => (
            <ListItem button={true} key={i} component={Link} to={obj.path}>
              <ListItemIcon className={classes.listIcon}>
                {obj.icon}
              </ListItemIcon>
              <ListItemText className={classes.listText} primary={obj.title} />
            </ListItem>
          ))}
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
                to="/"
                classes={{ text: classes.toolbarButtonText }}
              >
                Messages
              </Button>
              <Button
                className={classes.toolbarButton}
                startIcon={<CalendarViewDay />}
                component={Link}
                to="/"
                classes={{ text: classes.toolbarButtonText }}
              >
                Appointments
              </Button>
              <Button
                className={classes.toolbarButton}
                aria-label="user-account"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleMenuOpen}
                startIcon={<AccountCircle />}
                endIcon={<ArrowDropDown />}
              >
                John Barber
              </Button>
            </Box>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderMobileSidebar}
    </div>
  );
}

export default Sidebar;
