import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Container, Paper, Button, Grid, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
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
          <Paper className={classes.paper}>Stylist Info</Paper>
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