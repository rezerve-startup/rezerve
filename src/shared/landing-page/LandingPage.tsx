import React from 'react';
import { Link } from 'react-router-dom';
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
} from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';
//Extra
import FaceIcon from '@material-ui/icons/Face';
import PanToolIcon from '@material-ui/icons/PanTool';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
//----

import CustomerBusinessSearch from '../../customer/customer-business-search/CustomerBusinessSearch';

//import Sidebar from '../shared/sidebar/sidebar';

//--------------------------
//CSS
//--------------------------
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
    },
    buttonLogin: {
      borderRadius: '30px',
      marginRight: '5px',
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
      border: '1px solid white',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.light,
      },
    },
    buttonSignup: {
      borderRadius: '30px',
      marginRight: '5px',
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

//--------------------------
//Landing Page component
//--------------------------
function LandingPageDefault() {
  const classes = useStyles();

  const [tabValue, setTabValue] = React.useState(0);
  const handleTabChange = (
    event: React.ChangeEvent<{}>,
    newTabValue: number,
  ) => {
    setTabValue(newTabValue);
  };

  return (
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
              <Button
                className={classes.buttonLogin}
                variant="contained"
                href="/temp-login"
              >
                Log in
              </Button>
              <Button
                className={classes.buttonSignup}
                variant="contained"
                href="/sign-up-page"
              >
                Sign Up
              </Button>
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
  );
}

export default LandingPageDefault;
