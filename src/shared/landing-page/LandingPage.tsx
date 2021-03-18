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
  FormControl,
  Select,
  useScrollTrigger,
  Divider,
  Typography,
  Button,
} from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//Extra
import FaceIcon from '@material-ui/icons/Face';
import PanToolIcon from '@material-ui/icons/PanTool';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
//----

//import Services from './business-services/Services';
import Search from './landingSearch';

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
          <Typography>{children}</Typography>
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

  const trigger = useScrollTrigger();

  return (
    <div>
      <AppBar className={classes.container} position="sticky">
        <Box m={1}>
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <h1>ReZerve</h1>
            </Grid>
            <Grid>
              <Button className={classes.buttonLogin} variant="contained">
                Log in
              </Button>
              <Button className={classes.buttonSignup} variant="contained" href='/sign-up-page'>
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box m={1}>
          <AppBar position="static">
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
              <Tab
                label="Barber"
                icon={<EmojiPeopleIcon />}
                {...a11yProps(4)}
              />
              <Divider orientation="vertical" flexItem />
              <Tab label="House Calls" icon={<HomeIcon />} {...a11yProps(6)} />
            </Tabs>
          </AppBar>
        </Box>
        <Search />
        <Box m={1}>
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <div>
                Location&nbsp;
                <LocationOnIcon fontSize="small" style={{ color: '#FF2B2B' }} />
              </div>
            </Grid>
            <Grid item>
              <FormControl variant="outlined">
                <Select
                  className={classes.select}
                  native
                  //onChange={handleChange}
                  IconComponent={ExpandMoreIcon}
                >
                  <option value={1}>SortBy: Near me</option>
                  <option value={2}>SortBy: Ratings</option>
                  <option value={3}>SortBy: Name </option>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </AppBar>

      <TabPanel tabValue={tabValue} index={0}>
        Item One
      </TabPanel>
      <TabPanel tabValue={tabValue} index={2}>
        Item Two
      </TabPanel>
      <TabPanel tabValue={tabValue} index={4}>
        zzzzzzzzzzzz
      </TabPanel>
      <TabPanel tabValue={tabValue} index={6}>
        Item Four
      </TabPanel>
    </div>
  );
}

export default LandingPageDefault;
