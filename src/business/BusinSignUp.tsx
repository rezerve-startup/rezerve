import React from 'react';
import {
    Button,
    Container,
    TextField,
    Checkbox,
    FormControlLabel,
    Grid,
    createStyles,
    makeStyles,
    Theme
} from '@material-ui/core';
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import BusinessAccountInfo from '../business/BusinAccInfo';

const useStyles = makeStyles((theme:Theme) => 
    createStyles({
        root: {
            backgroundColor: theme.palette.secondary.dark,
            minHeight: '100vh',
            color: theme.palette.secondary.light,
            paddingTop: 30
        },
        nextButton: {
            position: 'fixed',
            bottom: theme.spacing(4),
            right: theme.spacing(3)
        },
        textField: {
            '& label.MuiInputLabel-root': {
                color: theme.palette.primary.dark,
              },
          '& label.Mui-focused': {
            color: theme.palette.secondary.light,
          },
          '& .MuiInputBase-input': {
            color: theme.palette.primary.dark, // Text color
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
    })
);

function BusinessSignUp() {
    const classes = useStyles();
    return (
            <Container className={classes.root} maxWidth={false}>
                <form autoComplete="off">
                    <Grid container spacing={4} direction="column"
                         alignContent="center" alignItems="flex-start" justify="center" >
                        <Grid item xs={12}>
                            <h1>I&nbsp;am</h1>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox className={classes.checkbox} />}
                                label="Mobile stylist"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox className={classes.checkbox} />}
                                label="Barber"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox className={classes.checkbox} />}
                                label="Nail Salon"
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <FormControlLabel
                                control={
                                    <Checkbox className={classes.checkbox} />}
                                label="Other"
                            />
                        </Grid>
                        <Grid item xs={7} sm={7} lg={7}>
                            <TextField label="" disabled/>
                        </Grid>
                        <Grid item xs={12}>
                            <Router>
                                <Button variant="contained" color="primary" className={classes.nextButton}
                                to={'/businAccountInfo'} component={Link}>
                                Next
                                </Button>
                                <Switch>
                                    <Route path="/businAccountInfo" component={BusinessAccountInfo} />
                                </Switch>
                            </Router>
                        </Grid>
                    </Grid>
                </form>
            </Container>
  );
}
/*function BusinessSignUp(props: any) {
  // const [state, setState] = useState({
  //         hairstylist: false,
  //         barber: false,
  //         nailSalon: false,
  //         other: false,
  //         otherTextbox: ""
  // });

  // const handleInputChange = event: any =>{
  //     const target = event.target;
  //     const value = target.type === 'checkbox' ? target.checked : target.value;
  //     const name = target.name;

  //     setState({
  //         ...state,[name]: value,
  //     });

  //     //console.log("-CHANGE-Touched Name  " + name);
  //     if((name === "other" && value === true) || state.other === true)
  //         document.getElementById("otherTextbox").disabled= false;
  //     else
  //     {
  //         document.getElementById("otherTextbox").disabled= true;
  //         document.getElementById("otherTextbox").value= "";
  //         setState({
  //             ...state,otherTextbox: "",
  //         });
  //     }
  // };

   const handleSubmit = event =>{
        console.log("Current State is" + JSON.stringify(state))
        event.preventDefault();
    } 

  return (
    <div className="business-signUp-page">
      <div className="container" id="businSignUp">
        { <Form> onSubmit={handleSubmit}
                    <div className="row col col-11 col-md-auto offset-2 offset-sm-0">
                        <h1>I am</h1>
                    </div>
                    <FormGroup row>
                        <div className="row col-11 offset-2 offset-sm-0">
                            <label className="labelContainer"> 
                                <span className="labelText">Hairstylist</span>
                                <input type="checkbox" name="hairstylist" onChange={handleInputChange}/>
                                <span className="checkmark"></span>
                            </label>
                        </div>    
                    </FormGroup>
                    <FormGroup row>
                        <div className="row col-11 offset-2 offset-sm-0">
                            <label className="labelContainer">
                                <span>Barber</span>
                                <input type="checkbox" name="barber" onChange={handleInputChange}/>
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </FormGroup>
                    <FormGroup row>
                        <div className="row col-11 offset-2 offset-sm-0">
                            <label className="labelContainer">
                                <span>Nail salon</span>
                                <input type="checkbox" name="nailSalon" onChange={handleInputChange}/>
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </FormGroup>
                    <FormGroup row>
                        <div className="row col-11 offset-2 offset-sm-0">
                            <label className="labelContainer">
                                <span>Other</span>
                                <input type="checkbox" name="other" onChange={handleInputChange}/>
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </FormGroup>
                    <FormGroup row>
                        <div className="inputText row col-10 offset-2 offset-sm-0">
                            <input type="text" name="otherTextbox" onChange={handleInputChange} 
                                id="otherTextbox" disabled={true}></input>
                        </div>
                    </FormGroup>
                    <FormGroup row>
                        <div className="Next row col-11 offset-1 offset-sm-0">
                            <Link to="/BusinActInfo">
                                <button type="submit" className="btn btn-danger">
                                    NEXT
                                </button>
                            </Link>
                        </div>
                    </FormGroup>
                </Form> }
      </div>
    </div>
  );
}
*/
export default BusinessSignUp;
