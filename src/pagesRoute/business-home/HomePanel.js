import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Container, Box, Paper, Button, Grid, useMediaQuery, Card, CardContent, CardActions, CardMedia, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, TextField } from '@material-ui/core';
import { Rating } from "@material-ui/lab";
import image from "../../images/avatar.jpg";
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';


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
  },
  userContent: {
    flex: '1 0 auto'
  },
  userImage: {
    width: 150,
    height: 150
  },
  userRating: {
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
          <CardContent className={classes.userContent}>
            <Typography component="h5" variant="h5">Name</Typography>
            <Typography variant="subtitle1" color="textSecondary">Position</Typography>
            <StyledRating
              className={classes.userRating}
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
            className={classes.userImage}
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