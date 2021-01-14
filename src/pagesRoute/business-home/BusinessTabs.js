import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, AppBar, Tab, Tabs, Typography, useMediaQuery } from '@material-ui/core';
import { Home, List, Person, Assessment } from '@material-ui/icons'

import HomePanel from './HomePanel';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  }
}))

export default function BusinessTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  }

  const tabs = [
    { label: "Home", icon: <Home/> },
    { label: "Appointments", icon: <List/> },
    { label: "Clients", icon: <Person/> },
    { label: "Preformance", icon: <Assessment/> }
  ]

  return (
    <div className={classes.root}>
      <Box m={2}>
        <AppBar position="static" color="default">
          <Tabs
            value={value} 
            onChange={handleChange} 
            aria-label="business-tabs"
            indicatorColor="primary"
            centered 
            variant={isSmallScreen ? "scrollable" : "fullWidth"}
            scrollButtons="on"
          >
            {
              tabs.map((tab, i) => (
                <Tab key={i} label={tab.label} icon={tab.icon} {...a11yProps(i)}></Tab>
              ))
            }
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rt1' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
          enableMouseEvents
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <HomePanel></HomePanel>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            Item Two
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `business-tab-${index}`,
    'aria-controls': `business-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`business-tabpanel-${index}`}
      aria-labelledby={`business-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};