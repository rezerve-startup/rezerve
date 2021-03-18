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
    nextButton: {
      position: 'fixed',
      bottom: theme.spacing(4),
      right: theme.spacing(3),
    },
    textField: {
      '& label.MuiInputLabel-root': {
        color: theme.palette.secondary.light,
      },
      '& label.Mui-focused': {
        color: theme.palette.secondary.light,
      },
      '& .MuiInputBase-input': {
        color: theme.palette.secondary.light, // Text color
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: theme.palette.secondary.light,
      },
      '& .MuiInput-underline:hover:before': {
        borderBottomColor: theme.palette.secondary.light,
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: theme.palette.secondary.light,
      },
    },
    checkbox: {
      color: theme.palette.secondary.light,
    },
    inputlabel: {
      color: theme.palette.secondary.light,
    },
    select: {
      color: theme.palette.secondary.light,
    },
  }),
);

function BusinessPersonalInfoPage() {
    const classes = useStyles();
    return(
    <Container className={classes.root} maxWidth={false}>
    <form autoComplete="off">
      <Grid
        container
        spacing={4}
        direction="column"
        alignContent="center"
        alignItems="flex-start"
        justify="center"
      >
        <Grid item xs={12}>
          <h1>Personal&nbsp;Info</h1>
        </Grid>
        <Grid item xs={12}>
          <TextField className={classes.textField} label="Email" />
        </Grid>
        <Grid item xs={12}>
          <TextField className={classes.textField} label="Phone number" />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.nextButton}
            href='/temp-login'
          >
            Setup My Business Suite
          </Button>
        </Grid>
      </Grid>
    </form>
  </Container>
  );
}

export default BusinessPersonalInfoPage;
