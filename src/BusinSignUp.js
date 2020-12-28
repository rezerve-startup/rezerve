import React, { useState } from 'react';
import {Form, FormGroup} from 'reactstrap';
import {Link} from 'react-router-dom';
import './CSS/BusinSignUp.css';

function BusinessSignUp(props) {

    const [state,setState] = useState({
            hairstylist: false,
            barber: false,
            nailSalon: false,
            other: false,
            otherTextbox: ""
    });  

    const handleInputChange = event =>{
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setState({
            ...state,[name]: value,
        });

        //console.log("-CHANGE-Touched Name  " + name);
        if((name === "other" && value === true) || state.other === true)
            document.getElementById("otherTextbox").disabled= false;
        else
        {
            document.getElementById("otherTextbox").disabled= true;
            document.getElementById("otherTextbox").value= "";
            setState({
                ...state,otherTextbox: "",
            });
        }
    };

    const handleSubmit = event =>{
        console.log("Current State is" + JSON.stringify(state))
        event.preventDefault();
    }



    return(
        <div className='business-signUp-page'>
            <div className='container' id="businSignUp">
                <Form onSubmit={handleSubmit}>
                    <div className="row col col-11 col-md-auto offset-1 offset-sm-0">
                        <h1>I am</h1>
                    </div>
                    <FormGroup row>
                        <div className="row col-11 offset-1 offset-sm-0">
                            <label className="labelContainer">Hairstylist
                                <input type="checkbox" name="hairstylist" onChange={handleInputChange}/>
                                <span className="checkmark"></span>
                            </label>
                        </div>    
                    </FormGroup>
                    <FormGroup row>
                        <div className="row col-11 offset-1 offset-sm-0">
                            <label className="labelContainer">Barber
                                <input type="checkbox" name="barber" onChange={handleInputChange}/>
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </FormGroup>
                    <FormGroup row>
                        <div className="row col-11 offset-1 offset-sm-0">
                            <label className="labelContainer">Nail salon
                                <input type="checkbox" name="nailSalon" onChange={handleInputChange}/>
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </FormGroup>
                    <FormGroup row>
                        <div className="row col-11 offset-1 offset-sm-0">
                            <label className="labelContainer">Other
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
                </Form>
            </div>
        </div>
    );
}

export default BusinessSignUp;