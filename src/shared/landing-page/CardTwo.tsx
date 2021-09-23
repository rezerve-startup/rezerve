import React from 'react';
import {
  Button,
  Card,
  CardActions,
  Typography,
  TextField,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  CardContent,
  Divider,
  Snackbar,
  IconButton,
  makeStyles,
  Grid,
  CardHeader,
  CardMedia
} from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';
import LoginDefault from '../login/loginDefault';
import SignUpPage from '../sign-up/SignUpPage';
import BackImg1 from '../../assets/background_image_1.png';
import logo from '../../assets/favicon.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardStyle: {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
      [theme.breakpoints.down('sm')]: {
        backgroundImage: `url(${BackImg1})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }
    },
    logo: {
      paddingBottom: '30px',
      height: '40px'
    },
    container: {
      minHeight: '80vh'
    },
    fontColor: {
      color: theme.palette.primary.main,
    },
    button: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.light
    },
    borderLeft: {
      borderLeft: '2px solid white',
    },
    borderRight: {
      borderRight: '2px solid white',
    },
    testUnderlined: {
      color: theme.palette.primary.main,
      borderBottom: '2px solid white'
    },
    title: {
      display: 'block',
      color: theme.palette.background.paper,
      textDecoration: 'none',
      fontFamily: 'Raleway'
    },
    spanZ: {
      color: theme.palette.primary.main,
    }
  }),
);

function CardTwo(){
    const classes = useStyles();

    
    return(
        <Card className={classes.cardStyle}>
          <CardContent>
            <Grid container justifyContent="space-between">
              <Grid>
                <Typography
                  className={classes.title}
                  variant="h6"
                  noWrap={true}
                  color="primary"
                  //component={Link}
                  //to="/"
                >
                  <b>Re<span className={classes.spanZ}>Z</span>erve</b>
                </Typography>
              </Grid>
              <Grid>
                <Grid>
                  <CardMedia
                    className={classes.logo}
                    component="img"
                    image={logo}
                    alt="logo"
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid className={classes.container} 
              container justifyContent="center" alignItems="center" direction="column" spacing={4}>
              
              <Grid item>
                <Typography variant="h6">
                  Find the <span className={classes.fontColor} >Best</span> stylists near you
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Grid container justifyContent="center" spacing={3}>
                  <Grid item className={classes.borderRight}>
                    <Typography variant="h6" className={classes.testUnderlined}>
                      ANYTIME
                    </Typography>
                  </Grid>
                  <Grid item className={classes.borderLeft}>
                    <Typography variant="h6" className={classes.testUnderlined}>
                      ANYWHERE
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row" justifyContent="flex-end">
                  <Grid item>
                    <LoginDefault />
                  </Grid>
                  <Grid item>
                    <SignUpPage />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
    );
}

export default CardTwo;
