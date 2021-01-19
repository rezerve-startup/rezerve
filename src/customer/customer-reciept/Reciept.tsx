import React from 'react';
// import * as FaIcons from 'react-icons/fa'
import { Divider } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import './receipt.css';

function Receipt() {
  const useStyles = makeStyles((theme) => ({
    divider: {
      // Theme Color, or use css color in quote
      background: '#FF4949',
      color: 'white',
      height: '10px',
      width: '95%',
      margin: 'auto',
    },
  }));
  const classes = useStyles();

  return (
    <div className="receipt-page">
      <div className="items">
        <h1>
          <strong>Receipt</strong>
        </h1>
        {/* <Link to="/services"><FaIcons.FaTimes class="close-icon"/> </Link> */}
      </div>

      <div className="items">
        <h2>
          <strong>Sally's Hair Salon</strong>
        </h2>
      </div>

      <div className="items">
        <h2>
          <strong>Cindy</strong>
        </h2>
        <img className="image" src="/assets/cat3.jpg" alt="" />
      </div>

      <div className="items">
        <h3>
          <strong>Sat 1/16/2021</strong>
        </h3>
        <h3 className="stat">4:00pm</h3>
      </div>

      <div className="receipt">
        <div className="items">
          <h1>Card #2753</h1>
        </div>

        <div className="items">
          <h3>Haircut</h3>
          <h3 className="stat">$35.00</h3>
        </div>

        <div className="items">
          <h3>Booking Fee:</h3>
          <h3 className="stat">$1.00</h3>
        </div>

        <Divider variant="middle" className={classes.divider} />

        <div className="items">
          <h3>Total:</h3>
          <h3 className="stat">$36.00</h3>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
