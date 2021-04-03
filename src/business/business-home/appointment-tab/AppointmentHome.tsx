import React from 'react';
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
import EmployeeCalendarAppointments from './EmployeeCalendarAppointments';
import EmployeeRequestedAppointments from './EmployeeRequestedAppointments';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function AppointmentHome() {
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
    { label: '', icon: <Description /> },
    { label: '', icon: <CalendarToday /> },
  ];

  return (
    <div className={classes.root}>
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
            <EmployeeRequestedAppointments />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <EmployeeCalendarAppointments />
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
