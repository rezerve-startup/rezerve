import React from 'react';
// import Card from "react-bootstrap/Card";
import './BusinessCard.css';
// import * as FaIcons from '../../customer/user-reciept/node_modules/react-icons/fa'
// import { IconContext } from 'react-icons'

type Props = {
  business: any;
  distance: string;
  rating: string;
  img: string;
};

class BusinessCard extends React.Component<Props, {}> {
  render() {
    return (
      <p>filler</p>
      // <Card style={{height: '207px', width: '437px', margin: 'auto'}}>
      //   <Card.Img  style={{height: '204px', width: '434px'}} src={this.props.img} alt="Card image" />
      //   <Card.ImgOverlay
      //     style={{ padding: "1%", background: "rgba(0,0,0,0.75)" }}
      //   >
      //     <div class="business">
      //       <Card.Text>{this.props.business}</Card.Text>
      //     </div>
      //     <div class="links">
      //         <Card.Subtitle class="distance">
      //           <FaIcons.FaMapMarkerAlt/>{" " + this.props.distance + " mi"}
      //           </Card.Subtitle>
      //       <Card.Img class="rating" style={{height: "30px", width: "150px"}} src={"assets/" + this.props.rating +".png"}/>
      //     </div>
      //   </Card.ImgOverlay>
      // </Card>
    );
  }
}

export default BusinessCard;
