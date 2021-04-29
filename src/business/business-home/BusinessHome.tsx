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
} from '@material-ui/core';
import { Home, List, Person, Assessment, People } from '@material-ui/icons';
import ClientTab from '../employee-home/client-tab/ClientTab';
import HomePanel from './HomeTab';
import { connect } from 'react-redux';
import { firestore } from '../../config/FirebaseConfig';
import { StoreState } from '../../shared/store/types';
import AppointmentPanel from '../employee-home/appointment-tab/AppointmentHome';
import EmployeesTab from './EmployeesTab'
import Sidebar from '../../shared/sidebar/Sidebar';
import { Redirect } from 'react-router';

const styles = (_theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  });

interface CustomTab {
  label: string;
  icon: React.ReactElement<SvgIconProps>;
}

interface Props extends WithStyles<typeof styles> {}

type State = {
  business: any;
  businessId: string;
  tabs: CustomTab[];
  tabValue: number;
};

function mapStateToProps(state: StoreState) {
  return {
    business: state.business,
    user: state.system.user
  };
}

class BusinessHome extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      business: undefined,
      businessId: '',
      tabs: [
        { label: 'Home', icon: <Home /> },
        { label: 'Appointments', icon: <List /> },
        { label: 'Clients', icon: <Person /> },
        // { label: 'Employees', icon: <People />},
        { label: 'Preformance', icon: <Assessment /> },
      ],
      tabValue: 0,
    };
  }

  componentDidMount() {
    const fetchedBusinesses: any[] = [];
    let businessId = ''

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
        businessId = doc.id
        fetchedBusinesses.push(business);
      });

      this.setState({
        business: fetchedBusinesses,
        businessId
      });
    });
  }

  render() {
    const { classes } = this.props;
    const isMobile = true;

    if (this.props.user === undefined) {
      return <Redirect to={'/'} />
    }

    return (
      <div className={classes.root}>
        <Sidebar/>
        <Box m={1}>
          
          <AppBar position="static" color="default">
            <Tabs
              value={this.state.tabValue}
              onChange={this.handleChange}
              aria-label="business-tabs"
              indicatorColor="primary"
              centered={isMobile ? false : true}
              variant={isMobile ? 'scrollable' : 'fullWidth'}
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
          <SwipeableViews
            index={this.state.tabValue}
            onChangeIndex={this.handleChangeIndex}
            enableMouseEvents={true}
          >
            <TabPanel value={this.state.tabValue} index={0}>
              <HomePanel isMobile={isMobile} />
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={1}>
              <AppointmentPanel />
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={2}>
              <ClientTab employeeName="Test Employee" />
            </TabPanel>
            {/* <TabPanel value={this.state.tabValue} index={3}>
              <EmployeesTab businessId={this.state.businessId} />
            </TabPanel> */}
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

export default connect(mapStateToProps, null)(
  withStyles(styles, { withTheme: true }
)(BusinessHome));
