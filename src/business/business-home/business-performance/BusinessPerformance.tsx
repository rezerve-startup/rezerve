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

import { firestore } from '../../../config/FirebaseConfig';
import { connect } from 'react-redux';
import { Review } from '../../../models/Review.interface';
import { User } from '../../../models/User.interface';

type BusinessPerformanceState = {
  loading: boolean;
  tabSelected: number;
  businessPerformance: {
    abandonedCarts: number;
    bookingPercentage: number;
    profileViews: number;
    rating: number;
  };
  businessReviewsStored: any[];
  businessReviewsShown: any[];
  business: any;
};

//interface Props extends WithStyles<typeof styles> {}

class BusinessPerformance extends React.Component<
  any,
  BusinessPerformanceState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      tabSelected: 0,
      loading: false,
      businessPerformance: {
        abandonedCarts: 0,
        bookingPercentage: 0,
        profileViews: 0,
        rating: 0,
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
    const businessData = firestore
      .collection('businesses')
      .doc('98amGMWjvPkULXgBerJq');

    businessData
      .get()
      // Get business info data
      .then((val) => {
        const businessInfo = val.data();
        if (businessInfo !== undefined) {
          this.setState({
            business: businessInfo,
            businessPerformance: businessInfo.performance,
          });
        }
      })
      // Get business reviews
      .then(() => {
        let numberReviewsShown = 0;

        this.state.business.reviews.forEach((reviewId: any) => {
          let tempBusinessReview;

          firestore
            .collection('reviews')
            .doc(`${reviewId}`)
            .get()
            .then((review) => {
              tempBusinessReview = review.data() as Review;
            })
            .then(() => {
              firestore
                .collection('users')
                .where('customerId', '==', `${tempBusinessReview.customerId}`)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    tempBusinessReview.poster = (doc.data() as User).firstName;
                  });
                })
                .then(() => {
                  if (numberReviewsShown < 3) {
                    this.setState({
                      businessReviewsShown: [...this.state.businessReviewsShown, tempBusinessReview]
                    });

                    numberReviewsShown += 1;
                  } else {
                    this.setState({
                      businessReviewsStored: [...this.state.businessReviewsStored, tempBusinessReview]
                    });
                  }
                });
            });
        });
      });
  }

  handleChange = (_event: any, newTabSelected: number) => {
    this.setState({
      tabSelected: newTabSelected,
    });
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
                  <div>{this.state.businessPerformance.bookingPercentage}%</div>
                </div>
              </div>
            </div>

            <div className={classes.sectionTitle}>
              <div>Reviews & Rating</div>
            </div>
            <h2>{this.state.businessPerformance.rating}</h2>
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

export default connect(
  null,
  null,
)(withStyles(styles, { withTheme: true })(BusinessPerformance));
