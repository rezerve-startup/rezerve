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
  CardMedia,
  Hidden
} from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';
import SignUpPage from '../sign-up/SignUpPageDialog';
import BackImg2 from '../../assets/background_image_2.png';
import logo from '../../assets/favicon.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardStyle: {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
      [theme.breakpoints.down('sm')]: {
        backgroundImage: `url(${BackImg2})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }
    },
    logo: {
      paddingBottom: '30px',
    },
    container: {
      minHeight: '80vh'
    },
    fontColor: {
      color: theme.palette.primary.main,
    },
    title: {
      display: 'block',
      color: theme.palette.background.paper,
      textDecoration: 'none',
      fontFamily: 'Raleway',
    },
    spanZ: {
      color: theme.palette.primary.main,
    },
    customText: {
      [theme.breakpoints.down('xs')]: {
        fontSize: '14px'
      },
    },
  }),
);

function CardOne(){
    const classes = useStyles();
    return(
        <Card className={classes.cardStyle}>
          <CardContent>
            <Grid container justifyContent="space-between">
                <Grid xs={11} md={12}>
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
                <Grid xs={1}>
                  <Hidden mdUp>
                    <CardMedia
                        className={classes.logo}
                        component="img"
                        image={logo}
                        alt="logo"
                    />
                  </Hidden>
                  </Grid>
              </Grid>
            
            <Grid className={classes.container}
             container direction="column" justifyContent="center" alignItems="center" spacing={4}>
              
              

              <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12}>
                      <Typography variant="h4" className={classes.fontColor}>
                        Improve
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h5">
                        the way you do business
                      </Typography>
                    </Grid>
                </Grid>
              </Grid>

              <Grid item className={classes.customText}>
                <Grid container direction="row" justifyContent="space-around" spacing={3}>

                  <Grid item>
                    <Grid container>
                      <Grid item>
                        <Clear fontSize='small' className={classes.fontColor}/> 
                      </Grid>
                      <Grid item>
                        wasted time
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item>
                    <Grid container>
                      <Grid item>
                        <Clear fontSize='small' className={classes.fontColor}/> 
                      </Grid>
                      <Grid item>
                        stress
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item>
                    <Grid container>
                      <Grid item>
                        <Clear fontSize='small' className={classes.fontColor}/> 
                      </Grid>
                      <Grid item>
                        Missed opportunities
                      </Grid>
                    </Grid>
                  </Grid>

                </Grid>
              </Grid>                

              <Grid item xs={12}>
                <Typography variant="h6">
                  Sign Up to set up your <span className={classes.fontColor} >free</span> personal assistant
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Grid container direction="row" justifyContent="flex-end">
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

export default CardOne;
