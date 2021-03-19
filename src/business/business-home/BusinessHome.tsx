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
import HomePanel from './home-tab/HomeTab';
import BusinessPerformance from './business-performance/BusinessPerformance';
import { connect } from 'react-redux';
import { firestore } from '../../config/FirebaseConfig';
import { StoreState } from '../../shared/store/types';
import AppointmentPanel from './appointment-tab/AppointmentHome';
import Sidebar from '../../shared/sidebar/sidebar';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    divider: {
      marginTop: '8px',
    },
  });

interface CustomTab {
  label: string;
  icon: React.ReactElement<SvgIconProps>;
}

interface Props extends WithStyles<typeof styles> {
  isMobile: boolean;
}

type State = {
  business: any;
  tabs: CustomTab[];
  tabValue: number;
};

function mapStateToProps(state: StoreState) {
  return {
    business: state.business,
  };
}

class BusinessHome extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      business: undefined,
      tabs: [
        { label: 'Home', icon: <Home /> },
        { label: 'Appointments', icon: <List /> },
        { label: 'Clients', icon: <Person /> },
        { label: 'Performance', icon: <Assessment /> },
      ],
      tabValue: 0,
    };
  }

  componentDidMount() {
    const fetchedBusinesses: any[] = [];

    firestore.collection('businesses').onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const barbers: any[] = [];
        firestore
          .collection('businesses')
          .doc(doc.id)
          .collection('barbers')
          .onSnapshot((snapshot2) => {
            snapshot2.docs.forEach((barber) => {
              barbers.push(barber.data());
            });
          });

        const business = doc.data();
        business.barbers = barbers;
        fetchedBusinesses.push(business);
      });

      console.log(fetchedBusinesses);
      this.setState({
        business: fetchedBusinesses,
      });
    });
  }

  render() {
    const { classes } = this.props;
    // const isMobile = false;
    return (
      <div className={classes.root}>
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
              <HomePanel isMobile={this.props.isMobile} />
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={1}>
              <AppointmentPanel />
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={2}>
              <ClientTab employeeName="Test Employee" />
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={3}>
              <BusinessPerformance />
            </TabPanel>
          </SwipeableViews>
        </Box>
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
  )(withStyles(styles, { withTheme: true })(BusinessHome)),
);
