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
      '&.Mui-checked': {
        '& .MuiIconButton-label': {
          color: theme.palette.primary.light,
        },
      },
    },
    inputlabel: {
      color: theme.palette.secondary.light,
    },
    select: {
      color: theme.palette.secondary.light,
    },
  }),
);

function BusinessAccountInfo() {
  const classes = useStyles();
  return (
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
            <h1>Account&nbsp;Info</h1>
          </Grid>
          <Grid item xs={12}>
            <TextField className={classes.textField} label="Name" />
          </Grid>
          <Grid item xs={12}>
            <TextField className={classes.textField} label="Store Name" />
          </Grid>
          <Grid item xs={12}>
            <TextField className={classes.textField} label="Location" />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox className={classes.checkbox} />}
              label="Mobile stylist"
            />
          </Grid>
          <Grid item xs={12}>
            <h4>Employees</h4>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox className={classes.checkbox} />}
              label="Sole Business owner"
            />
          </Grid>
          <Grid item xs={5} sm={5} lg={5} direction="row">
            <FormControl>
              <InputLabel className={classes.inputlabel}>Employees</InputLabel>
              <Select className={classes.select}>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={11}>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={7} sm={7} lg={7}>
            <TextField className={classes.textField} label="Other" disabled />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className={classes.nextButton}
              href="/business-personal-info"
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default BusinessAccountInfo;
