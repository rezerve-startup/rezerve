import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Container, Paper, Button, Grid, useMediaQuery, Card, CardActions, CardContent, List, ListItem, ListItemText, ListItemSecondaryAction, TextField } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minWidth: 300,
    minHeight: 300
  },
  card:{
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minWidth: 300,
    minHeight: 300

  },
  openHours:{
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
  var daysOfWeek = [{day: "Monday", start: "09:00", end: "17:00"},
                    {day: "Tuesday", start: "09:00", end: "17:00"},
                    {day: "Wednesday", start: "09:00", end: "17:00"},  
                    {day: "Thursday", start: "09:00", end: "17:00"},  
                    {day: "Friday", start: "09:00", end: "17:00"},  
                    {day: "Saturday", start: "09:00", end: "17:00"}, 
                    {day: "Sunday", start: "09:00", end: "17:00"}]
  return (
      <Card className = {classes.card}>
        Avaliability 
        <List className = {classes.openHours}>
          {daysOfWeek.map(item => (
          <ListItem key = {item.day}>
          <ListItemText primary={item.day}/> 
            <ListItemSecondaryAction> 
              <Grid container justify="space-between" spacing={1}>
                <Grid item sx>
                  <form noValidate>
                  <TextField id="time" type = "Time" disabled={true} defaultValue = {item.start}/>
                  </form>
                </Grid>
                to
                <Grid item sx>
                  <form noValidate>
                  <TextField id="time" type = "Time" disabled={true} defaultValue = {item.end}/>
                  </form>
                </Grid>
              </Grid>
            </ListItemSecondaryAction>
          </ListItem>
                  ))}
        </List>
        <CardActions style={{justifyContent: 'center'}}>
          <Button size='small' color="secondary">edit</Button>
        </CardActions>
      </Card>
    )
}

function ContactCard() {
  const classes = useStyles()
  return (
    <Paper className={classes.paper}>Contact Information</Paper>
  )
}