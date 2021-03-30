import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Theme,
  makeStyles,
  withStyles,
  createStyles,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import image from '../../../assets/avatar.jpg';
import { connect } from 'react-redux';
import { StoreState } from '../../../shared/store/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: theme.spacing(1),
    },
    userContent: {
      flex: '1 0 auto',
    },
    userImage: {
      width: '125px',
      height: '100%',
    },
    userRating: {
      marginTop: '16px',
    },
  }),
);

function mapStateToProps(state: StoreState) {
  return {
    employeeName: state.system.user.firstName,
    employeeId: state.system.user.employeeId,
    employeePosition: state.system.user.employeeInfo.position,
    employeeReviews: state.system.user.employeeInfo.reviews
  };
};

function computeAvgReviewRating(reviews: any[]) {
  let totalReviewRating = 0;

  reviews.forEach((review) => {
    totalReviewRating += review.rating;
  });

  return totalReviewRating / reviews.length;
}

type Props = {
  isMobile: boolean;
  employeeName?: string;
  employeeId?: string;
  employeePosition?: string;
  employeeReviews?: any
};

const StylistCard = (props: Props) => {
  const { isMobile } = props;
  const classes = useStyles();

  let avgEmployeeReview = computeAvgReviewRating(props.employeeReviews);

  return (
    <Card className={classes.card} elevation={0}>
      <Grid container={true} justify="space-between" spacing={2}>
        <Grid item={true}>
          <CardContent className={classes.userContent}>
            <Typography variant="h5">{props.employeeName}</Typography>
            <Typography variant="subtitle1" color="textSecondary">{props.employeePosition}</Typography>
            <StyledRating
              className={classes.userRating}
              value={avgEmployeeReview}
              precision={0.5}
              size={isMobile ? 'medium' : 'large'}
              readOnly={true}
            />
          </CardContent>
        </Grid>
        <Grid item={true}>
          <CardMedia
            className={classes.userImage}
            image={image}
            title="Employee Image"
          />
        </Grid>
      </Grid>
    </Card>
  );
}

const StyledRating = withStyles((theme) => ({
  iconFilled: {
    color: theme.palette.primary.main,
  },
  iconHover: {
    color: theme.palette.primary.light,
  },
}))(Rating);

export default connect(mapStateToProps, null)(StylistCard);
