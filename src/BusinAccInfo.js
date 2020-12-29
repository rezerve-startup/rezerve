import React, { useState } from 'react';
import { FormCheck, FormControl, FormLabel } from 'react-bootstrap';
import {Form, FormGroup} from 'reactstrap';
import {Link} from 'react-router-dom';
import './CSS/BusinAccInfo.css';

function BusinessAccountInfo(props) {
    return(
        <div className='business-account-info'>
            <div className='container'>
                <Form> {/* onSubmit={handleSubmit} */}
                    <div className="row col col-11 col-md-auto offset-1 offset-sm-0">
                        <h1>Account&nbsp;info</h1>
                    </div>
                    <FormGroup row>
                        <div className="inputText row col-10 offset-2 offset-sm-0" >
                            <label>Name</label>
                            <input type="text" name="name"  
                                id="name"></input>
                        </div>
                    </FormGroup>
                    <FormGroup row>
                        <div className="inputText row col-10 offset-2 offset-sm-0" >
                            <label>Store Name</label>
                            <input type="text" name="storeName"  
                                id="storeName"></input>
                        </div>
                    </FormGroup>
                    <FormGroup row>
                        <div className="inputText row col-10 offset-2 offset-sm-0" >
                            <label>Location</label>
                            <input type="text" name="location"  
                                id="location"></input>
                        </div>
                    </FormGroup>
                    <FormGroup row>
                        <div className="row col-11 offset-1 offset-sm-0">
                            <label className="labelContainer">Mobile Stylist
                                <input type="checkbox" name="mobileStylist" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </FormGroup>
                    <FormGroup row>
                        <FormLabel>Employees</FormLabel>
                        <div className="row col-11 offset-1 offset-sm-0">
                            <label className="labelContainer">Sole business owner
                                <input type="checkbox" name="mobileStylist" />
                                <span className="checkmark"></span>
                            </label>
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

export default BusinessAccountInfo;