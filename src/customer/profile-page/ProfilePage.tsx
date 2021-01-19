import React, { useState } from 'react';
import logo from '../../images/avatar.jpg';
import { TextField } from '@material-ui/core/';
import './user-profile.css';
//import {firestore} from '../../config/FirebaseConfig';
import { firestore } from '../../config/FirebaseConfig';

function ProfilePage() {
  const [username, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  // const [nav, setNav] = useState(false);
  // const [pw1, setPW1] = useState("");
  // const [newPW, setPW] = useState("");
  // const [confPW, confirmPW] = useState("");

  firestore.collection('users').onSnapshot((snapshot) => {
    const data = snapshot.docs[0].data().userData;
    console.log(data);

    setName(data.username);
    setPhoneNumber(data.phone_number);
    setEmailAddress(data.email_address);
  });
  // const showNav = () => setNav(!nav);
  // const togglePW = () => {
  //   if (nav === true) {
  //     showNav(false);
  //   }
  // };
  const infoList = [
    {
      stat: 'Username',
      current: username,
    },
    {
      stat: 'Phone Number',
      current: phoneNumber,
    },
    {
      stat: 'Email Address',
      current: emailAddress,
    },
  ];

  return (
    // <ClickAwayListener onClickAway={togglePW}>
    <div>
      <div className="page_layout">
        <h1>Edit Account</h1>

        <img src={logo} className="image" alt="" />

        {/* <a href="#">Change</a> */}
      </div>
      {infoList.map((item, index) => {
        return (
          <div className="item_layout">
            <h2 key={index}>{item.stat}</h2>
            <span />
            <TextField required id={item.stat} value={item.current} />
          </div>
        );
      })}

      <div className="page_layout">
        {/* <a href="#" onClick={showNav}>
            Change Password?
          </a> */}
      </div>

      <div className="item_layout">
        <button className="button">Save Changes</button>
      </div>

      <div className="item_layout">
        {/* <nav className={nav ? "pw-menu active" : "pw-menu"}> */}
        <div className="item_layout">
          <h1>Password Change</h1>
        </div>

        <div className="item_layout">
          {/* <TextField
                className="textfield"
                label="Current Password"
                id="current-password"
                value={pw1}
                type="password"
                variant="outlined"
              /> */}
        </div>

        <div className="item_layout">
          {/* <TextField
                className="textfield"
                label="New Password"
                id="current-password"
                value={newPW}
                type="password"
                variant="outlined"
              /> */}
        </div>

        <div className="item_layout">
          {/* <TextField
                className="textfield"
                label="Confirm New Password"
                id="current-password"
                value={confPW}
                type="password"
                variant="outlined"
              /> */}
        </div>

        <div className="item_layout">
          {/* <button className="button" onClick={togglePW}>
                Confirm Request
              </button> */}
        </div>
        {/* </nav> */}
      </div>
    </div>
    // </ClickAwayListener>
  );
}

export default ProfilePage;
