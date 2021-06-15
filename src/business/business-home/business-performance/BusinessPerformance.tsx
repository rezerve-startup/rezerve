import React from 'react';
import { Rating } from '@material-ui/lab';
import {
  CircularProgress,
  withStyles,
  createStyles,
  Theme,
  Avatar,
  Tab,
  Tabs,
  Button,
  List,
} from '@material-ui/core';
import firebase from 'firebase';
import { firestore } from '../../../config/FirebaseConfig';
import { connect } from 'react-redux';
import { Review } from '../../../models/Review.interface';
import { User } from '../../../models/User.interface';
import { StoreState } from '../../../shared/store/types';

type BusinessPerformanceState = {
  businessId: string;
  loading: boolean;
  tabSelected: number;
  businessPerformance: {
    abandonedCarts: number;
    bookingPercentage: number;
    profileViews: number;
    rating: number;
    ratingCount: number;
    totalRevenue: number;
    appointmentsTotal: number;
    completedAppointments: number;
    cancelledAppointments: number;
  };
  businessReviewsStored: any[];
  businessReviewsShown: any[];
  business: any;
};

function mapStateToProps(state: StoreState) {
  return {
    business: state.business,
    businessId: state.system.user.employeeInfo.businessId,
  };
}

//interface Props extends WithStyles<typeof styles> {}

class BusinessPerformance extends React.Component<
  any,
  BusinessPerformanceState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      businessId: this.props.businessId,
      tabSelected: 0,
      loading: false,
      businessPerformance: {
        abandonedCarts: 0,
        bookingPercentage: 0,
        profileViews: 0,
        rating: 0,
        ratingCount: 0,
        totalRevenue: 0,
        appointmentsTotal: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
      },
      businessReviewsStored: [],
      businessReviewsShown: [],
      business: undefined,
    };
  }

  componentDidMount() {
    this.getBusinessPerformanceData();
  }

  getBusinessPerformanceData() {
    firestore
      .collection('businesses')
      .doc(this.state.businessId)
      .get()
      // Get business info data
      .then((val) => {
        const businessInfo = val.data();
        if (businessInfo !== undefined) {
          this.setState({
            business: businessInfo,
            businessPerformance: this.getPerformance(businessInfo),
          });
        }
      })
      // Get business reviews
      .then(() => {
        this.state.business.reviews?.forEach((reviewId: any) => {
          let tempBusinessReview;

          firestore
            .collection('reviews')
            .doc(`${reviewId}`)
            .get()
            .then((review) => {
              tempBusinessReview = review.data() as Review;
              const timeCheck = this.getTimeCheck(this.state.tabSelected);
              if (tempBusinessReview.date > timeCheck) {
                this.getUserForRating(tempBusinessReview);
                this.getRating(tempBusinessReview);
              }
            });
        });
      });
  }

  getPerformance(info: any): any {
    const today = new Date();
    const now = firebase.firestore.Timestamp.fromDate(today);
    const abandonedCarts: any[] = [];
    const completedCarts: any[] = [];
    const profileViews: any[] = [];
    const timeCheck = this.getTimeCheck(this.state.tabSelected);

    if (info.performance) {
      info.performance.forEach((data: any) => {
        if (data.date < now && data.date > timeCheck) {
          if (data.type === 'AbandonedCart') {
            abandonedCarts.push(data);
          } else if (data.type === 'CompletedCart') {
            completedCarts.push(data);
          } else if (data.type === 'ProfileView') {
            profileViews.push(data);
          }
        }
      });
    }

    const result = this.state.businessPerformance;
    result.abandonedCarts = abandonedCarts.length;
    result.bookingPercentage = (completedCarts.length + abandonedCarts.length) === 0 ?
      0 :
      completedCarts.length / (completedCarts.length + abandonedCarts.length);
    result.bookingPercentage *= 100;
    result.profileViews = profileViews.length;

    info.employees.forEach((employeeId : string) => {
      firestore.collection('employees')
        .doc(employeeId)
        .get()
        .then(value => {
          const employee = value.data();
          employee?.appointments?.forEach((appointmentId : string) => {
            firestore.collection('appointments')
              .doc(appointmentId)
              .get()
              .then(value => {
                const appointment = value.data();
                if (appointment?.datetime < now && appointment?.datetime > timeCheck) {
                  if (appointment?.status !== 'cancelled') {
                    result.totalRevenue += appointment?.service.price;
                    result.completedAppointments++;
                  } else if (appointment?.status === 'cancelled') {
                    result.cancelledAppointments++;
                  }
                  result.appointmentsTotal++;
                }
              });
          });
        })
    });

    return result;
  }

  getUserForRating(review: Review): void {
    let numberReviewsShown: number;

    firestore
      .collection('users')
      .where('customerId', '==', `${review.customerId}`)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          review.poster = (doc.data() as User).firstName;
        });
      })
      .then(() => {
        if (numberReviewsShown < 3) {
          this.setState({
            businessReviewsShown: [...this.state.businessReviewsShown, review]
          });

          numberReviewsShown += 1;
        } else {
          this.setState({
            businessReviewsStored: [...this.state.businessReviewsStored, review]
          });
        }
      });
  }

  getRating(review: Review): void {
    const performance = this.state.businessPerformance;
    const average = performance.rating * performance.ratingCount;
    performance.ratingCount++;
    performance.rating = (average + review.rating) / performance.ratingCount;
    this.setState({
      businessPerformance: performance
    });
  }

  getTimeCheck(tabSelected: number): firebase.firestore.Timestamp {
    const date = new Date();

    if (tabSelected === 0) {
      date.setDate(date.getDate() - 1);
    } else if (tabSelected === 1) {
      date.setDate(date.getDate() - 7);
    } else if (tabSelected === 2) {
      date.setDate(date.getDate() - 30);
    } else if (tabSelected === 3) {
      date.setDate(date.getDate() - 365);
    }

    return firebase.firestore.Timestamp.fromDate(date);
  } 

  handleChange = (_event: any, newTabSelected: number) => {
    this.setState({
      tabSelected: newTabSelected,
      businessPerformance: {
        abandonedCarts: 0,
        bookingPercentage: 0,
        profileViews: 0,
        rating: 0,
        ratingCount: 0,
        totalRevenue: 0,
        appointmentsTotal: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
      },
      businessReviewsStored: [],
      businessReviewsShown: [],
    });

    this.getBusinessPerformanceData();
  };

  showMoreReviews() {
    let tempReviewsStored = this.state.businessReviewsStored.slice();
    let tempReviewsShown = this.state.businessReviewsShown.slice();

    let valuesChanged = false;

    for (let i = 0; i < 3; i++) {
      if (tempReviewsStored[i]) {
        tempReviewsShown.push(tempReviewsStored[i]);
        tempReviewsStored.splice(i, 1);

        valuesChanged = true;
      }
    }

    if (valuesChanged) {
      this.setState({
        businessReviewsShown: tempReviewsShown,
        businessReviewsStored: tempReviewsStored
      });
    }  
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.businessInfoPage}>
        {this.state.loading === false && this.state.business ? (
          <div className={classes.businessOverview}>
            <div className={classes.selectedPeriodTabs}>
              <Tabs
                value={this.state.tabSelected}
                onChange={this.handleChange}
                aria-label="ant example"
              >
                <Tab label="Day" />
                <Tab label="Week" />
                <Tab label="Month" />
                <Tab label="Year" />
              </Tabs>
            </div>

            <div className={classes.sectionTitle}>
              <div>Appointments</div>
            </div>
            <div>
              <div className={classes.businessPerformanceItem}>
                <div>Appointments</div>
                <div>{this.state.businessPerformance.appointmentsTotal}</div>
              </div>
              <div className={classes.businessPerformanceItemContainer}>
                <div className={classes.businessPerformanceItem}>
                  <div>Completed</div>
                  <div>{this.state.businessPerformance.completedAppointments}</div>
                </div>
                <div className={classes.businessPerformanceItem}>
                  <div>Cancelled</div>
                  <div>{this.state.businessPerformance.cancelledAppointments}%</div>
                </div>
              </div>
            </div>

            <div className={classes.sectionTitle}>
              <div>Marketing</div>
            </div>
            <div>
              <div className={classes.businessPerformanceItem}>
                <div>Profile Views</div>
                <div>{this.state.businessPerformance.profileViews}</div>
              </div>
              <div className={classes.businessPerformanceItemContainer}>
                <div className={classes.businessPerformanceItem}>
                  <div>Abandoned Carts</div>
                  <div>{this.state.businessPerformance.abandonedCarts}</div>
                </div>
                <div className={classes.businessPerformanceItem}>
                  <div>Booking Percentage</div>
                  <div>{this.state.businessPerformance.bookingPercentage.toFixed(2)}%</div>
                </div>
              </div>
            </div>

            

            {/* <div className={classes.sectionTitle}>
              Profits
            </div>
            <div className={classes.businessPerformanceItem}>
              Total Revenue
              <div>${this.state.businessPerformance.totalRevenue.toFixed(2)}</div>
            </div> */}

            <div className={classes.sectionTitle}>
              <div>Reviews & Rating</div>
            </div>
            <h2>{this.state.businessPerformance.rating.toFixed(2)}</h2>
            <p>Rating</p>
            <Rating
              size="medium"
              value={this.state.businessPerformance.rating}
              precision={0.5}
              readOnly={true}
              classes={{
                iconFilled: classes.starRatingFilled,
                iconHover: classes.starRatingHover,
              }}
            />

            <div className={classes.reviewsContainer}>
              <div>
                <List className={classes.reviewsList}>
                  {this.state.businessReviewsShown.map((review, i) => {
                    return (
                      <div className={classes.businessReview} key={i}>
                        <div className={classes.reviewAvatar}>
                          <Avatar />
                        </div>
                        <div className={classes.reviewContent}>
                          <div>
                            <b>{review.poster}</b>
                          </div>
                          <div>{review.message}</div>
                        </div>
                        <div className={classes.reviewRating}>
                          <div>
                            {new Date(review.date.toDate()).toLocaleDateString()}
                          </div>
                          <div>
                            <Rating
                              size="small"
                              value={review.rating}
                              precision={0.5}
                              readOnly={true}
                              classes={{
                                iconFilled: classes.starRatingFilled,
                                iconHover: classes.starRatingHover,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </List>
              </div>
            </div>

            {this.state.businessReviewsStored.length > 0 && 
              <div>
                <Button variant="contained" onClick={() => this.showMoreReviews()}>Show More</Button>
              </div>
            }
          </div>
        ) : (
          <div className={classes.loadingContainer}>
            <CircularProgress size={75} />
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    businessInfoPage: {
      textAlign: 'center',
      alignItems: 'center',
    },
    businessOverview: {
      padding: ' 0.5rem 2.5rem 2.5rem 2.5rem',
    },
    businessPerformanceItemContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    businessPerformanceItem: {
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: '0.25rem',
      margin: '0.25rem',
      padding: '0.25rem',
      flex: 1,
    },
    starRatingFilled: {
      color: theme.palette.primary.main,
    },
    starRatingHover: {
      color: theme.palette.primary.light,
    },
    sectionTitle: {
      textAlign: 'left',
      fontSize: 20,
      fontWeight: 800,
      margin: '0.5rem 0.25rem 0.5rem 0.25rem',
    },
    businessReview: {
      display: 'flex',
      justifyContent: 'space-around',
      textAlign: 'start',
      marginBottom: '0.5rem',
    },
    reviewAvatar: {
      flex: 1,
      marginRight: '0.5rem',
    },
    reviewContent: {
      flex: 5,
      marginRight: '0.5rem',
    },
    reviewRating: {
      flex: 2,
      marginLeft: '0.25rem',
      textAlign: 'center',
      alignContent: 'center',
    },
    selectedPeriodTabs: {
      display: 'flex',
      justifyContent: 'center',
    },
    reviewsList: {
      maxHeight: '10rem',
      overflow: 'auto'
    }
  });

  export default connect(mapStateToProps, {})(
    withStyles(styles, { withTheme: true })(BusinessPerformance)
  );
