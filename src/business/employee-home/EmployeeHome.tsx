import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {
  Box,
  AppBar,
  Tab,
  Tabs,
  Theme,
  WithStyles,
  createStyles,
  withStyles,
  SvgIconProps,
  useMediaQuery,
  useTheme,
  Divider,
} from '@material-ui/core';
import { Home, List, Person, Assessment } from '@material-ui/icons';
import ClientTab from './client-tab/ClientTab';
import HomeTab from './home-tab/HomeTab';
import BusinessPerformance from '../business-home/business-performance/BusinessPerformance';
import { connect } from 'react-redux';
import { firestore } from '../../config/FirebaseConfig';
import { StoreState } from '../../shared/store/types';
import AppointmentHome from './appointment-tab/AppointmentHome';
import { Redirect } from 'react-router';
import Sidebar from '../../shared/sidebar/Sidebar';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    divider: {
      marginTop: '8px',
    },
    appBar: {
      backgroundColor: '#353535'
    },
  });

interface CustomTab {
  label: string;
  icon: React.ReactElement<SvgIconProps>;
}

interface Props extends WithStyles<typeof styles> {
  isMobile: boolean;
  business?: any;
  user?: any;
}

type State = {
  user: any;
  tabs: CustomTab[];
  tabValue: number;
};

function mapStateToProps(state: StoreState) {
  return {
    user: state.system.user
  };
}

class EmployeeHome extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: this.props.user,
      tabs: [
        { label: 'Home', icon: <Home /> },
        { label: 'Appointments', icon: <List /> },
        { label: 'Clients', icon: <Person /> },
      ],
      tabValue: 0,
    };
  }

  componentDidMount() {
  }

  render() {
    const { classes } = this.props;
    // const isMobile = false;

    if (this.props.user === undefined) {
      return <Redirect to={'/'} />
    }

    return (
      <div className={classes.root}>
        {this.state.user.employeeInfo.businessId && 
        <div>
          <Sidebar />
          <Box m={1}>
            <AppBar position="static" color="transparent" elevation={0}>
              <Tabs
                value={this.state.tabValue}
                onChange={this.handleChange}
                aria-label="business-tabs"
                indicatorColor="primary"
                centered={this.props.isMobile ? false : true}
                variant={this.props.isMobile ? 'scrollable' : 'fullWidth'}
                scrollButtons="on"
              >
                {this.state.tabs.map((tab: CustomTab, i: number) => (
                  <Tab
                    key={i}
                    label={tab.label}
                    icon={tab.icon}
                    {...a11yProps(i)}
                  />
                ))}
              </Tabs>
            </AppBar>
            <Divider className={classes.divider} variant="fullWidth" />
            <SwipeableViews
              index={this.state.tabValue}
              onChangeIndex={this.handleChangeIndex}
              enableMouseEvents={true}
            >
              <TabPanel value={this.state.tabValue} index={0}>
                <HomeTab isMobile={this.props.isMobile} />
              </TabPanel>
              <TabPanel value={this.state.tabValue} index={1}>
                <AppointmentHome />
              </TabPanel>
              <TabPanel value={this.state.tabValue} index={2}>
                <ClientTab />
              </TabPanel>             
            </SwipeableViews>
          </Box>
        </div>
        }
      </div>
    );
  }

  handleChange = (_event: any, newValue: number) => {
    this.setState({
      tabValue: newValue,
    });
  };

  handleChangeIndex = (index: number) => {
    this.setState({
      tabValue: index,
    });
  };
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

export const withMediaQuery = (Component: any) => {
  return (props: any) => {
    const theme = useTheme();
    const isMobileProp = useMediaQuery(theme.breakpoints.down('sm'));
    return <Component isMobile={isMobileProp} {...props} />;
  };
};

export default withMediaQuery(
  connect(
    mapStateToProps,
    null,
  )(withStyles(styles, { withTheme: true })(EmployeeHome)),
);
