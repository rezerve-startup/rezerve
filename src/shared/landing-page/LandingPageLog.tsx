import React from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  makeStyles,
  createStyles,
  Theme,
  Box,
  Divider,
  Typography,
} from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';
//Extra
import FaceIcon from '@material-ui/icons/Face';
import PanToolIcon from '@material-ui/icons/PanTool';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
//----

import CustomerBusinessSearch from '../../customer/customer-business-search/CustomerBusinessSearch';
import Sidebar from '../sidebar/sidebar';
import { Redirect } from 'react-router';
import { StoreState } from '../store/types';
import { connect } from 'react-redux';

//--------------------------
//CSS
//--------------------------
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
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

  const [tabValue, setTabValue] = React.useState(0);
  const handleTabChange = (
    event: React.ChangeEvent<{}>,
    newTabValue: number,
  ) => {
    setTabValue(newTabValue);
  };

  if (props.user === undefined) {
    return <Redirect to={'/'} />
  }

  return (
    <div>
      <Sidebar />
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
          <Tab label="Barber" icon={<EmojiPeopleIcon />} {...a11yProps(4)} />
          <Divider orientation="vertical" flexItem />
          <Tab label="House Calls" icon={<HomeIcon />} {...a11yProps(6)} />
        </Tabs>
      </AppBar>

      {/*</AppBar>*/}

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

export default connect(mapStateToProps, null)(
  LandingPageLoggedIn
);
