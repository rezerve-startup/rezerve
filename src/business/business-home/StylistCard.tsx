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
import image from '../../assets/avatar.jpg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: theme.spacing(2),
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

type Props = {
  isMobile: boolean
}

export default function StylistCard(props: Props) {
  const { isMobile } = props
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Grid container={true} justify="space-between" spacing={2}>
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
              size={isMobile ? "medium" : "large"}
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
