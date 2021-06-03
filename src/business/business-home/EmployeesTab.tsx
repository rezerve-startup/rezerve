import React, { useEffect } from 'react';
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
import { firestore } from '../../config/FirebaseConfig';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function EmployeeTab(props: any) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [employees, setEmployees]: any[] = React.useState([])
  const [employeeRequests, setEmployeeRequests]: any[] = React.useState([])
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const businessId = props.businessId
    const tmpEmployees: any = []
    const tmpEmployeeRequests: any = []
    firestore
      .collection('businesses')
      .doc(businessId)
      .get()
      .then((docRef) => {
        const employeeIds: string[] = docRef.data()?.employees
        const employeeReqIds: string[] = docRef.data()?.employeeRequests

        firestore
          .collection('employees')
          .onSnapshot((snapshot) => {
            snapshot.docs.forEach((doc) => {
              if (employeeIds.includes(doc.id)) {
                tmpEmployees.push(doc.data())
              } else if (employeeReqIds.includes(doc.id)) {
                tmpEmployeeRequests.push(doc.data())
              }
            })

            setEmployees(tmpEmployees);
            setEmployeeRequests(tmpEmployeeRequests);
          })
      })
      .catch((e) => {
        console.log(e)
      })
  })

  const handleChange = (_event: any, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const tabs = [
    { label: 'Employees', icon: <Description /> },
    { label: 'Employee Requests', icon: <CalendarToday /> },
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
            {employeeRequests.forEach((emp) => {
              return (
                <p>Employee</p>
              )
            })
          }
          </TabPanel>
          <TabPanel value={value} index={1}>
            Test
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
