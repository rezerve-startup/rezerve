import React, { useState } from 'react';
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
                        <div className="row col-11 offset-1 offset-sm-0" >Name</div>
                        <div className="inputText row col-11 offset-1 offset-sm-0" >
                            <input type="text" name="name"  
                                id="name"></input>
                        </div>
                    </FormGroup>
                    <FormGroup row>
                        <div className="row col-11 offset-1 offset-sm-0" >Store Name</div>
                        <div className="inputText row col-11 offset-1 offset-sm-0" >
                            <input type="text" name="storeName"  
                                id="storeName"></input>
                        </div>
                    </FormGroup>
                    <FormGroup row>
                        <div className="row col-11 offset-1 offset-sm-0" >Location</div>
                        <div className="inputText row col-11 offset-1 offset-sm-0" >
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
                        <div className="row col-11 offset-1 offset-sm-0" id="AccInfoLabelAboveCont">Employees</div>
                        <div className="row col-11 offset-1 offset-sm-0">
                            <label className="labelContainer">Sole business owner
                                <input type="checkbox" name="soleBusinOwner" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"/>
                        <div className="row col-4 col-sm-2 offset-1 offset-sm-0">
                            <label className="accInfoSelect">
                                <select class="form-control" id="businAccInfoSelect">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                    <option>9</option>
                                    <option>10</option>
                                    <option value="O">Other</option>
                                </select>
                            </label>
                        </div>
                        <div className="inputText row col-7 col-sm-9">
                            <input type="text" name="location" style={{width:"60px"}}  
                                id="accInfoSmallTextbox"></input>
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