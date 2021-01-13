import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Container, Box, Paper, Button, Grid, useMediaQuery, Card, CardContent, CardActions, CardHeader, CardMedia, Typography } from '@material-ui/core';
import { Rating } from "@material-ui/lab";
import { Favorite } from "@material-ui/icons";
import image from "../../images/avatar.jpg";
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  card: {
    display: 'flex',
    margin: 'auto'
  },
  content: {
    flex: '1 0 auto'
  },
  image: {
    width: 150,
    height: 150
  },
  rating: {
    marginTop: '16px'
  }
}))

export default function HomePanel() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  var carouselComponents = [AvailablityCard, ContactCard]

  return (
    <div className={classes.root}>
      <Grid container spacing={2} direction={isMobile ? "column" : "row"}>
        <Grid item xs>
          <StylistCard/>
        </Grid>
        <Grid item xs>
          <Carousel>
            {carouselComponents.map(Component => <Component />)}
          </Carousel>
        </Grid>
      </Grid>
      <Grid container spacing={2} direction={isMobile ? "column" : "row" }>
        <Grid item xs>
          <Paper className={classes.paper}>Upcoming Appointments</Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.paper}>Todo List</Paper>
        </Grid>
      </Grid>
    </div>
  )
}

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  }
})(Rating);

function StylistCard() {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      <Grid container justify="space-between" spacing={4}>
        <Grid item>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">Name</Typography>
            <Typography variant="subtitle1" color="textSecondary">Position</Typography>
            <StyledRating
              className={classes.rating}
              value={3.5}
              defaultValue={2.5}
              precision={0.5}
              size="large"
              readOnly
            />
          </CardContent>
        </Grid>
        <Grid item>
          <CardMedia
            className={classes.image}
            image={image}
            title="Employee Image"
          />
        </Grid>
      </Grid>
    </Card>
  )
}

function AvailablityCard() {
  const classes = useStyles()
  return (
      <Paper className={classes.paper}>Availability</Paper>
  )
}

function ContactCard() {
  const classes = useStyles()
  return (
    <Paper className={classes.paper}>Contact Information</Paper>
  )
}