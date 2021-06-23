import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  AppBar,
  Tabs,
  Tab,
  makeStyles,
  createStyles,
  Theme,
  Box,
  Grid,
  Divider,
  Typography,
  Button,
  CircularProgress,
} from '@material-ui/core';
import SignUpPage from '../sign-up/SignUpPage'
import HomeIcon from '@material-ui/icons/Home';
//Extra
import FaceIcon from '@material-ui/icons/Face';
import PanToolIcon from '@material-ui/icons/PanTool';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
//----

import { 
  setUserEmployeeInfo,
  setUserCustomerInfo, 
  setBusinessAvailability 
} from '../../shared/store/actions';
import CustomerBusinessSearch from '../../customer/customer-business-search/CustomerBusinessSearch';
import { StoreState } from '../store/types';
import { connect } from 'react-redux';
import { auth, firestore } from '../../config/FirebaseConfig';
import firebase from 'firebase';
import LoginDefault from '../login/loginDefault';

//import Sidebar from '../shared/sidebar/sidebar';

//--------------------------
//CSS
//--------------------------
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
      height: '10hv'
    },
    navItem: {
      backgroundColor: 'white',
      color: theme.palette.secondary.dark,
    },
    rightBorder: {
      '& .MuiTabs-indicator': {
        color: theme.palette.primary.dark,
      },
    },
    title: {
      display: 'block',
      color: theme.palette.background.paper,
      textDecoration: 'none',
    },
    appBar: {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
    },
    loadingSpinnerContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }
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
  return ({
    user: state.system.user,
    authChanging: state.system.authChanging
  })
}

//--------------------------
//Landing Page component
//--------------------------
const LandingPageDefault = (props: any) => {
  const classes = useStyles();

  const [tabValue, setTabValue] = React.useState(0);
  const [redirectToCustomer, setRedirectToCustomer] = React.useState(false);
  const [redirectToEmployee, setRedirectToEmployee] = React.useState(false);
  const handleTabChange = (
    event: React.ChangeEvent<{}>,
    newTabValue: number,
  ) => {
    setTabValue(newTabValue);
  };
  
  if (props.user) {
    if ((props.user.employeeId === '' && redirectToCustomer === false)) {
      setRedirectToCustomer(true);
    } else if (props.user.customerId === '' && redirectToEmployee === false) {
      setRedirectToEmployee(true)
    }
  }

  if (redirectToEmployee) {
    return <Redirect to={'/employee-home'} />
  }

  if (redirectToCustomer) {
    return <Redirect to={'/customer-home'} />
  }

  return (
      props.authChanging === false ? (
        <div>
          <AppBar className={classes.container} position="sticky">
            <Box m={1}>
              <Grid container alignItems="center" justify="space-between">
                <Grid item>
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
                </Grid>
                <Grid>
                  <Grid container>
                    <Grid item>
                      <LoginDefault />
                    </Grid>
                    <Grid item>
                      <SignUpPage />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </AppBar>
          
          <div className={classes.appBar}>
            <AppBar position="sticky">
              <Tabs
                centered
                value={tabValue}
                indicatorColor="primary"
                variant="fullWidth"
                onChange={handleTabChange}
                className={classes.navItem}
              >
                <Tab label="Hair" icon={<FaceIcon />} {...a11yProps(0)} />
                <Divider orientation="vertical" flexItem />
                <Tab label="Nail" icon={<PanToolIcon />} {...a11yProps(2)} />
                <Divider orientation="vertical" flexItem />
                <Tab label="Barber" icon={<EmojiPeopleIcon />} {...a11yProps(4)} />
                <Divider orientation="vertical" flexItem />
                <Tab label="House Calls" icon={<HomeIcon />} {...a11yProps(6)} />
              </Tabs>
            </AppBar>
          </div>
          <TabPanel tabValue={tabValue} index={0}>
            <CustomerBusinessSearch filter="hair" />
          </TabPanel>
          <TabPanel tabValue={tabValue} index={2}>
            <CustomerBusinessSearch filter="nails" />
          </TabPanel>
          <TabPanel tabValue={tabValue} index={4}>
            <CustomerBusinessSearch filter="barber" />
          </TabPanel>
          <TabPanel tabValue={tabValue} index={6}>
            <CustomerBusinessSearch filter="houseCall" />
          </TabPanel>
        </div>
      ) : (
        <div className={classes.loadingSpinnerContainer}>
          <CircularProgress />
        </div>
      )
  );
}

export default connect(mapStateToProps, { setUserCustomerInfo, setUserEmployeeInfo, setBusinessAvailability })(
  LandingPageDefault
);