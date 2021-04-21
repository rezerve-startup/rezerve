import React from 'react';
import Carousel from 'react-material-ui-carousel';
import {
  Paper,
  Grid,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import { setUserEmployeeAppointments } from '../../../shared/store/actions';

import StylistCard from './StylistCard';
import AvailabilityCard from './AvailabilityCard';
import ContactCard from './ContactCard';
import TodoList from './TodoList';
import { connect } from 'react-redux';
import { StoreState } from '../../../shared/store/types';
import { firestore } from '../../../config/FirebaseConfig';
import { Redirect } from 'react-router';
import EmployeeServicesCard from './EmployeeServicesCard';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
    card: {
      padding: theme.spacing(2),
    },
  });

interface Props extends WithStyles<typeof styles> {
  theme: Theme;
  isMobile: boolean;
  upcomingAppts?: any[];
  employeeId?: string;
  setUserEmployeeAppointments?: any
}
type State = {};

function mapStateToProps(state: StoreState) {
  let allAppointments = state.system.user.employeeInfo?.appointments;

  let upcomingAppts: any[] = [];

  let dateNow = Date.now();

  if (allAppointments) {
    allAppointments.forEach((appt) => {
      if (appt.datetime.toDate().valueOf() > dateNow) {
        upcomingAppts.push(appt);
      }
    })
  }

  return {
    upcomingAppts: upcomingAppts,
    employeeId: state.system.user.employeeId
  }
}

class HomeTab extends React.Component<Props, State> {
  
  componentDidMount() {
    this.getEmployeeAppointments();
  }

  dispatchSetUserEmployeeAppointments(employeeAppts) {
    this.props.setUserEmployeeAppointments(employeeAppts);
  }

  getEmployeeAppointments() {
    firestore.collection('appointments').where('employeeId', '==', `${this.props.employeeId}`).get()
      .then((querySnapshot) => {
        let employeeAppts: any[] = [];

        querySnapshot.forEach((apptDoc) => {
          const apptData = apptDoc.data();

          apptData.appointmentId = apptDoc.id;

          firestore.collection('users').where('customerId', '==', `${apptData.customerId}`).get()
            .then((querySnapshot) => {
              querySnapshot.forEach((userDoc) => {
                const userData = userDoc.data();

                apptData.client = {
                  firstName: userData.firstName,
                  lastName: userData.lastName
                }

                employeeAppts.push(apptData);

                this.dispatchSetUserEmployeeAppointments(employeeAppts);
              });
            })
        });
      })
  }

  render() {
    const { classes, isMobile } = this.props;
    const carouselComponents = [AvailabilityCard, ContactCard];

    return (
      <div className={classes.root}>
        <Grid container={true} spacing={1}>
          <Grid item={true} xs={isMobile ? 12 : 6}>
            <Grid container={true} spacing={2} direction="column">
              <Grid item={true} xs={true}>
                <StylistCard isMobile={isMobile} />
              </Grid>
              <Grid item={true} xs={true}>
                <Carousel
                  stopAutoPlayOnHover={true}
                  autoPlay={false}
                  animation="slide"
                  navButtonsAlwaysInvisible={isMobile ? true : false}
                >
                  {carouselComponents.map((Component, i) => (
                    <Component key={i} />
                  ))}
                </Carousel>
              </Grid>
            </Grid>
          </Grid>
          <Grid item={true} xs={isMobile ? 12 : 6}>
            <Grid container={true} spacing={1} direction="column">
              <Grid item={true} xs={true}>
                {this.props.upcomingAppts ? (
                    <Paper className={classes.paper} elevation={0}>
                      <Typography
                        component="h1"
                        variant="h1"
                        color="primary"
                        align="left"
                      >
                        {this.props.upcomingAppts.length}
                      </Typography>
                      <Typography
                        component="h5"
                        variant="h5"
                        align="left"
                        style={{ fontWeight: 600 }}
                      >
                        Upcoming Appointments
                      </Typography>
                    </Paper>
                ):(<></>)}
              </Grid>
              <Grid item={true} xs={true}>
                <EmployeeServicesCard />
              </Grid>
              <Grid item={true} xs={true}>
                <TodoList />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connect(mapStateToProps, { setUserEmployeeAppointments })(
  withStyles(styles, { withTheme: true, isMobile: false })(HomeTab)
);
