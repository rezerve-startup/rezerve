import React from 'react';
import {
    Button,
    Container,
    TextField,
    Checkbox,
    FormControl,
    FormControlLabel,
    Select,
    MenuItem,
    InputLabel,
    Grid,
    createStyles,
    makeStyles,
    Theme,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.secondary.dark,
      minHeight: '100vh',
      color: theme.palette.secondary.light,
      paddingTop: 15,
  },
    button: {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
      border: '1px solid white',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.light,
      }
    }
  }),
);
  
function SignUpPage() {
  const classes = useStyles();
  return (
    <Container className={classes.root} maxWidth={false}>
      <Grid container alignItems="center" direction='column'>
        <Grid item>
          <h4>Sign up</h4>
          <Button className={classes.button} href='/customer-sign-up'>Customer</Button>
        </Grid>
        <Grid item>
          <h4>Sign up</h4>
          <Button className={classes.button} href='/business-sign-up'>Business</Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SignUpPage;
