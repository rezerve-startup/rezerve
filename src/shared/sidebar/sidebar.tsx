import React, { useState } from 'react';
import { sidebarData } from './sidebarData';
import { Menu } from '@material-ui/icons';
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
} from '@material-ui/core';
import logo from '../../assets/avatar.jpg';

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
}));

function Sidebar() {
  const [state, setState] = useState({
    open: false,
  });

  const toggleSidebar = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, open });
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <React.Fragment>
            <IconButton
              edge="start"
              aria-label="menu"
              className={classes.menuButton}
              onClick={toggleSidebar(true)}
            >
              <Menu />
            </IconButton>
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
            <SwipeableDrawer
              anchor="left"
              open={state.open}
              onClose={toggleSidebar(false)}
              onOpen={toggleSidebar(true)}
              classes={{ paper: classes.sidebar }}
            >
              <div
                className={classes.list}
                role="presentation"
                onClick={toggleSidebar(false)}
                onKeyDown={toggleSidebar(false)}
              >
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src="../../assets/avatar.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      className={classes.listText}
                      primary="John Barber"
                    />
                  </ListItem>
                  <Divider className={classes.divider} />
                  {sidebarData.map((obj, i) => (
                    <ListItem
                      button={true}
                      key={i}
                      component={Link}
                      to={obj.path}
                    >
                      <ListItemIcon className={classes.listIcon}>
                        {obj.icon}
                      </ListItemIcon>
                      <ListItemText
                        className={classes.listText}
                        primary={obj.title}
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            </SwipeableDrawer>
          </React.Fragment>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Sidebar;
