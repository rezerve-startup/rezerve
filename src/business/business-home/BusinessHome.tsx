import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {
  Box,
  AppBar,
  Tab,
  Tabs,
  Theme,
  createStyles,
  withStyles,
  SvgIconProps,
  CircularProgress,
  Badge
} from '@material-ui/core';
import { Home, Assessment, People } from '@material-ui/icons';
import HomePanel from './HomeTab';
import EmployeesTab from './EmployeesTab';
import { connect } from 'react-redux';
import { firestore } from '../../config/FirebaseConfig';
import { StoreState } from '../../shared/store/types';
import Sidebar from '../../shared/sidebar/Sidebar';
import { Redirect } from 'react-router';
import BusinessPerformance from './business-performance/BusinessPerformance';
import { setEmployeeBusiness } from '../../shared/store/actions';

const styles = (_theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
  });

interface CustomTab {
  label: string;
  icon: React.ReactElement<SvgIconProps>;
}

// interface Props extends WithStyles<typeof styles> {}

// type State = {
//   business: any;
//   businessId: string;
//   tabs: CustomTab[];
//   tabValue: number;
//   businessNotifications: number;
//   employeeNotifications: number;
// };

function mapStateToProps(state: StoreState) {
  return {
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
        { label: 'Performance', icon: <Assessment /> },
        { label: 'Employees', icon: <People />},
      ],
      tabValue: 0,
      businessNotifications: 0,
      employeeNotifications: 0,
    };
  }

  dispatchSetEmployeeBusiness(employeeBusiness: any) {
    this.props.setEmployeeBusiness(employeeBusiness);
  }

  componentDidMount() {
    firestore.collection('businesses').where('employees', 'array-contains', this.props.user.employeeId).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((businessDoc) => {
          const businessData = businessDoc.data();

          this.dispatchSetEmployeeBusiness(businessData);
        });
      });
      this.getInformation()
  }

  getInformation(){
        firestore.collection('businesses')
          .doc(this.props.user.employeeInfo.businessId)
            .get()
              .then((docRef) => {
                const employeeReq: string[] = docRef.data()?.employeeRequests
                this.setState({
                  businessNotifications: employeeReq.length
                })
              })
      
      firestore.collection('appointments')
          .where("employeeId", "==", this.props.user.employeeId)
            .where("status", "==", "requested")
              .onSnapshot((snapshot) => {
                this.setState({
                  employeeNotifications: snapshot.size
                })
              })
      
  }

  handleNotification(){
    if(this.state.businessNotifications > 0){
      this.setState({
        businessNotifications: this.state.businessNotifications - 1
      })
    }
  }
  render() {
    const { classes } = this.props;
    const isMobile = true;

    if (this.props.user === undefined) {
      return <Redirect to={'/'} />
    }

    if (this.props.user.employeeInfo.business === undefined) {
      return (
        <div className={classes.loadingSpinner}>
          <CircularProgress size={75} />
        </div>
      )
    }
    return (
      <div className={classes.root}>
        <Sidebar businessNotifications={this.state.businessNotifications} employeeNotifications={this.state.employeeNotifications} />

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
                  icon={<Badge color="primary" badgeContent={tab.label === "Employees" ? (this.state.businessNotifications): 0}>{tab.icon}</Badge>}
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
              <BusinessPerformance />
            </TabPanel>
             <TabPanel value={this.state.tabValue} index={2}>
              <EmployeesTab businessId={this.props.user.employeeInfo.businessId} req={this.state.businessNotifications} this={this} services={this.props.user.employeeInfo.services}/>
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

export default connect(mapStateToProps, { setEmployeeBusiness })(
  withStyles(styles, { withTheme: true }
)(BusinessHome));
