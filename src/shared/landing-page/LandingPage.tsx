import {
  AppBar, Button, Box, CircularProgress, createStyles, Divider, Grid, makeStyles, Tab, Tabs, Theme, Typography, Card, Dialog
} from '@material-ui/core';
import React, { useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import CustomerBusinessSearch from '../../customer/customer-business-search/CustomerBusinessSearch';
// ----
import {
  locationStatus, setBusinessAvailability, setUserCustomerInfo, setUserEmployeeInfo, updateCurrentLatitude,
  updateCurrentLongitude
} from '../../shared/store/actions';
import LoginDefault from '../login/loginDefault';
import SignUpPage from '../sign-up/SignUpPage';
import { StoreState } from '../store/types';
import CardOne from './CardOne';
import CardTwo from './CardTwo';

// import Sidebar from '../shared/sidebar/sidebar';

// --------------------------
// CSS
// --------------------------
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
      fontFamily: 'Raleway'
    },
    spanZ: {
      color: theme.palette.primary.main,
    },
    appBar: {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
    },
    locationBox: {
      padding:'1px 1px 0px 1px',
      marginBottom: '0'
    },
    loadingSpinnerContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    },
    cardDialog: {
      backgroundColor: theme.palette.primary.main,
      minHeight: "100vh"
    },
    guestButton: {
      color: theme.palette.secondary.light,
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
    authChanging: state.system.authChanging,
    curLatitude: state.location.newLat,
    curLongitude: state.location.newLong,
    locStatus: state.location.newStatus
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
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(true);

  const locationStatus = props.locStatus;

  const dispatchLocationStatus = (status: boolean) => {
    props.locationStatus(status);
  }

  const getPosition = () => {
    if(navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(showPosition, positionError)
      //console.log("Geolocation was successful");
    }
    else {
      //console.log("Geolocation not supported");
      //dispatchLocation('36.0662', '94.1579')
    }
  }

  useEffect(() => {
    if(locationStatus === false){
      getPosition();
    }
  }, [] );

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

  //PROMPTS USER'S LOCATION AND STORE LATITUDE AND LONGITUDE IN REDUX
  const dispatchLocation = (latitude: number, longitude: number) => {
    props.updateCurrentLatitude(latitude);
    props.updateCurrentLongitude(longitude);
  }



  const positionError = () => {
    if(navigator.permissions) {
      navigator.permissions.query({name: 'geolocation'})
        .then(res => {
          if(res.state !== 'granted')
          {
            dispatchLocation(36.0662419, -94.15785299999999);
            //console.log('Unable to access your location.');
            setLoading(false)
          }
        })
      }
      else {
        //console.log('Unable to access your location.');
      }
    }

  const showPosition = (position) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    
    dispatchLocation(lat, long);
    dispatchLocationStatus(true);

    setLoading(false);
    
    //CONSOLE TEST
    //console.log("LOADING: " + JSON.stringify(loading));
    //console.log("LAT: " + JSON.stringify(lat));
    //console.log("LONG: " + JSON.stringify(long));
    //console.log("Latitude from props: " + stateLatitude);
    //console.log("Longitude from props: " + stateLongitude);
    //console.log("Status from props: " + locationStatus);
  }



  const carouselComponents = [CardOne,CardTwo];
  const handleClose = () => {
   setOpen(false);
  }

  if (props.authChanging === false){
  return (
        <div>
          <Dialog open={open} fullScreen={true} disableBackdropClick={true}>
            <div className={classes.cardDialog}>
                <Carousel
                stopAutoPlayOnHover={true}
                autoPlay={false}
                animation="slide"
                // navButtonsAlwaysInvisible={isMobile ? true : false}
                >
                  {carouselComponents.map((Component, i) => (
                    <Component key={i} />
                  ))}
              </Carousel>
              <Grid container alignContent="center" justify="center">
                    <Grid>
                      <Button variant="text" className={classes.guestButton} onClick={handleClose}>
                        Continue as Guest 
                      </Button>
                    </Grid>
              </Grid>
            </div>
            
          </Dialog>
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
                   <b>Re<span className={classes.spanZ}>Z</span>erve</b>
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
            {/*<Grid xs={true}>
                <Carousel
                  stopAutoPlayOnHover={true}
                  autoPlay={false}
                  animation="slide"
                  // navButtonsAlwaysInvisible={isMobile ? true : false}
                >
                  {carouselComponents.map((Component, i) => (
                    <Component key={i} />
                  ))}
                </Carousel>
                  </Grid>*/}
            <Box m={0} className={classes.appBar}>
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
            </Box>
          </AppBar>
          
            {loading ? 
              (<div className={classes.loadingSpinnerContainer}>
                <Grid container alignItems="center" justify="center" direction="row" 
                  style={{minHeight:'70vh'}}>
                  <Grid item>
                    <CircularProgress />
                  </Grid>
                </Grid>
              </div>)
              : 
              (<div>
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
                </div>)}
      </div>
      )
   }
   else {
     return(
    <div className={classes.loadingSpinnerContainer}>
      <CircularProgress />
    </div>
    );
   } 
}

export default connect(mapStateToProps, { setUserCustomerInfo, setUserEmployeeInfo, 
  setBusinessAvailability, updateCurrentLatitude, updateCurrentLongitude, locationStatus}) (LandingPageDefault);