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
import image from '../../images/avatar.jpg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: theme.spacing(2),
    },
    userContent: {
      flex: '1 0 auto',
    },
    userImage: {
      width: 150,
      height: 150,
    },
    userRating: {
      marginTop: '16px',
    },
  }),
);

export default function StylistCard() {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Grid container={true} justify="space-between" spacing={4}>
        <Grid item={true}>
          <CardContent className={classes.userContent}>
            <Typography variant="h5">Name</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Position
            </Typography>
            <StyledRating
              className={classes.userRating}
              value={3.5}
              defaultValue={2.5}
              precision={0.5}
              size="large"
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
