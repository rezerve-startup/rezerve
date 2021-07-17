import React, {useEffect} from 'react';
import {
  Tab,
  Tabs,
  AppBar,
  Box,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { CalendarToday, Description } from '@material-ui/icons';
import SwipeableViews from 'react-swipeable-views';
import CustomerCalendarAppointments from './CustomerCalendarAppointments';
import CustomerUpcomingAppointments from './CustomerAppointments';
import Sidebar from '../../shared/sidebar/Sidebar';
import { StoreState } from '../../shared/store/types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { firestore } from '../../config/FirebaseConfig';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function mapStateToProps(state: StoreState) {
  return({
    user: state.system.user
  })
}

const CustomerAppointmentHome = (props: any) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [appointmentCount, setAppointmentCount] = React.useState(0);
  
  useEffect(() => {
    getInformation();
}, [])

  const getInformation = () =>{
    firestore.collection('appointments')
          .where("customerId", "==", props.user.customerId)
            .where("status", "==", "accepted")
              .onSnapshot((snapshot) => {
                setAppointmentCount(snapshot.size)
              })
  }
  const handleChange = (_event: any, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const tabs = [
    { label: '', icon: <Description /> },
    { label: '', icon: <CalendarToday /> },
  ];

  if (props.user === undefined) {
    return <Redirect to={'/'} />
  }

  return (
    <div className={classes.root}>
      <Sidebar businessNotifications={0} employeeNotifications={appointmentCount}/>
      <Box m={1}>
        <AppBar position="relative" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="appointment-tabs"
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
            <CustomerUpcomingAppointments />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CustomerCalendarAppointments />
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
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
      id={`appointment-tab-${index}`}
      aria-labelledby={`appt-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={1}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `appointment-tab-${index}`,
    'aria-controls': `appointment-tabpanel-${index}`,
  };
}

export default connect(mapStateToProps, null)(
  CustomerAppointmentHome
);
