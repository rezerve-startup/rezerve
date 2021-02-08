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
    withStyles,
} from '@material-ui/core'

const useStyles = makeStyles((theme:Theme) => 
    createStyles({
        root: {
            backgroundColor: theme.palette.secondary.dark,
            minHeight: '100vh',
            color: theme.palette.secondary.light
        },
        nextButton: {
            position: 'fixed',
            bottom: theme.spacing(4),
            right: theme.spacing(3)
        }
    })
);

const CustomTextField = withStyles({
    root: {
        '& label.MuiInputLabel-root': {
            color: '#D7D7D7',
          },
      '& label.Mui-focused': {
        color: '#D7D7D7',
      },
      '& .MuiInputBase-input': {
        color: '#D7D7D7', // Text color
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: '#D7D7D7',
      },
      '& .MuiInput-underline:hover:before': {
        borderBottomColor: '#D7D7D7',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#D7D7D7',
      },
    },
  })(TextField);

function BusinessAccountInfo() {
    const classes = useStyles();
    return (
            <Container className={classes.root} maxWidth={false}>
                <form autoComplete="off">
                    <Grid container spacing={4} direction="column" alignItems="center" justify="center" >
                        <Grid item xs={12}>
                            <h1>Account&nbsp;Info</h1>
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField label="Name"/>
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField label="Store Name"/>
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField label="Location"/>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox />}
                                label="Mobile stylist"
                            />
                        </Grid>
                        <Grid item xs={12}>    
                            <h4>Employees</h4>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                <Checkbox />}
                                label="Sole Business owner"
                            />
                        </Grid>
                        <Grid item xs={5} sm={5} lg={5} direction="row">
                            <FormControl>
                                <InputLabel>Employees</InputLabel>
                                <Select>
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
                            <CustomTextField label="Other" disabled/>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" className={classes.nextButton}>
                                Next
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
  );
}

export default BusinessAccountInfo;