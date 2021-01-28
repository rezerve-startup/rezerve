import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {
  Box,
  AppBar,
  Tab,
  Tabs,
  useMediaQuery,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import { Home, List, Person, Assessment } from '@material-ui/icons';

import HomePanel from './home-tab/HomeTab';
import BusinessPerformance from './business-performance/BusinessPerformance';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function BusinessHome() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (_event: any, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const tabs = [
    { label: 'Home', icon: <Home /> },
    { label: 'Appointments', icon: <List /> },
    { label: 'Clients', icon: <Person /> },
    { label: 'Performance', icon: <Assessment /> },
  ];

  return (
    <div className={classes.root}>
      <Box m={1}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="business-tabs"
            indicatorColor="primary"
            centered={isMobile ? false : true}
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons="on"
          >
            {tabs.map((tab, i) => (
              <Tab
                key={i}
                label={tab.label}
                icon={tab.icon}
                {...a11yProps(i)}
              />
            ))}
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={value}
          onChangeIndex={handleChangeIndex}
          enableMouseEvents={true}
        >
          <TabPanel value={value} index={0}>
            <HomePanel isMobile={isMobile} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
          <TabPanel value={value} index={3}>
          <Tabs value={value} onChange={handleChange} aria-label="ant example">
              <Tab label="Day" />
              <Tab label="Week" />
              <Tab label="Month" />
              <Tab label="Year" />
            </Tabs>
            <BusinessPerformance />
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `business-tab-${index}`,
    'aria-controls': `business-tabpanel-${index}`,
  };
}

type TabPanelProps = {
  children: React.ReactNode;
  index: number;
  value: string | number | Error;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`business-tabpanel-${index}`}
      aria-labelledby={`business-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={1}>{children}</Box>}
    </div>
  );
}
