import {
  AppBar, Box, createStyles, Divider, makeStyles, Tab, Tabs, Theme, Typography
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
// tslint:disable-next-line: no-implicit-dependencies
import { Redirect } from 'react-router';
import { firestore } from '../../config/FirebaseConfig';
import CustomerBusinessSearch from '../../customer/customer-business-search/CustomerBusinessSearch';
import Sidebar from '../sidebar/Sidebar';
import { StoreState } from '../store/types';
//--------------------------
//CSS
//--------------------------
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
    },
   
    alert:{
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.secondary.light
    },

    navItem: {
      backgroundColor: 'white',
      color: theme.palette.secondary.dark,
    },
    select: {
      color: theme.palette.secondary.light,
      borderRadius: '30px',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.secondary.light,
      },
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.secondary.light,
          borderWidth: '1px',
        },
      },
      '&.Mui-focused': {
        color: theme.palette.primary.light,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.secondary.light,
          borderWidth: '1px',
        },
      },
      '&after': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.secondary.light,
        },
      },
      '& .MuiSelect-icon': {
        color: theme.palette.primary.light,
      },
    },
    rightBorder: {
      '& .MuiTabs-indicator': {
        color: theme.palette.primary.dark,
      },
    },
  }),
);
//--------------------------
//Tab panel
//--------------------------
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  tabValue: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, tabValue, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tabValue !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {tabValue === index && (
        <Box p={3}>
          <Typography component={'div'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    'aria-controls': `scrollable-prevent-tabpanel-${index}`,
  };
}

function mapStateToProps(state: StoreState) {
  return {
    user: state.system.user
  };
}

//--------------------------
//Landing Page component
//--------------------------
const LandingPageLoggedIn = (props: any) => {
  const classes = useStyles();
  const [appointmentCount, setAppointmentCount] = React.useState(0);
  const [tabValue, setTabValue] = React.useState(0);
  const handleTabChange = (
    event: React.ChangeEvent<{}>,
    newTabValue: number,
  ) => {
    setTabValue(newTabValue);
  };

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

  if (props.user === undefined) {
    return <Redirect to={'/'} />
  }

  return (
    <div>
      <Sidebar businessNotifications={0} employeeNotifications={appointmentCount}/>
      {
        (props.user.customerId === '')? (
          <div>
                <AppBar className={classes.alert} position="sticky">
                  <Typography align="center" variant="caption">
                      Your request is still awaiting business approval. When approved, you will gain access to employee features. 
                  </Typography>
                </AppBar>
              </div>
        ):("")
      }
      <AppBar position="static">
        <Tabs
          centered
          value={tabValue}
          indicatorColor="primary"
          variant="fullWidth"
          onChange={handleTabChange}
          className={classes.navItem}
        >
          <Tab label="Hair"{...a11yProps(0)} />
          <Divider orientation="vertical" flexItem />
          <Tab label="Nail"{...a11yProps(2)} />
          <Divider orientation="vertical" flexItem />
          <Tab label="Barber"{...a11yProps(4)} />
          <Divider orientation="vertical" flexItem />
          <Tab label="House Calls"{...a11yProps(6)} />
        </Tabs>
      </AppBar>

      <TabPanel tabValue={tabValue} index={0}>
        <CustomerBusinessSearch tabSelected={"Hair"}/> 
      </TabPanel>
      <TabPanel tabValue={tabValue} index={2}>
        <CustomerBusinessSearch tabSelected={"Nail"}/>
      </TabPanel>
      <TabPanel tabValue={tabValue} index={4}>
        <CustomerBusinessSearch tabSelected={"Barber"}/>
      </TabPanel>
      <TabPanel tabValue={tabValue} index={6}>
        <CustomerBusinessSearch tabSelected={"House Call"}/>
      </TabPanel>
    </div>
  );
}

export default connect(mapStateToProps, null)(
  LandingPageLoggedIn
);
