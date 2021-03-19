import React from 'react';
import {
  Button,
  Container,
  Grid,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

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
      color: theme.palette.primary.light,
      borderRadius: '0',
      boxShadow: 'none',
      borderBottom: '1px solid white',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.primary.dark,
        boxShadow: 'none',
      },
    },
  }),
);

function SignUpPage() {
  const classes = useStyles();
  return (
    <Container className={classes.root} maxWidth={false}>
      <Grid container alignItems="center" direction="column" spacing={5}>
        <Grid item>
          <h2>Sign up</h2>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            className={classes.button}
            href="/customer-sign-up"
          >
            Customer
          </Button>
        </Grid>
        <Grid item>
          <h2>Sign up</h2>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            className={classes.button}
            href="/business-sign-up"
          >
            Business
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SignUpPage;
