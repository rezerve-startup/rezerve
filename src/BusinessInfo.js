import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import CarouselItem from 'react-bootstrap/CarouselItem';
import './BusinessInfo.css'

class BusinessInfo extends Component {
    render() {
        return (
            <div class="business-info-page">
                <div class="business-overview">
                    <div class="carousel-container">
                        <Carousel class="image-carousel">
                            <Carousel.Item style={{"height": "300px"}} interval={3000}>
                                <img style={{"height": "300px", "width": "500px"}} className="d-block mx-auto" src={"assets/cat1.jpg"} />
                            </Carousel.Item>
                            <Carousel.Item style={{"height": "300px"}} interval={3000}>
                                <img style={{"height": "300px", "width": "500px"}} className="d-block mx-auto" src={"assets/cat2.jpg"} />
                            </Carousel.Item>
                            <Carousel.Item style={{"height": "300px"}} interval={3000}>
                                <img style={{"height": "300px", "width": "500px"}} className="d-block mx-auto" src={"assets/cat3.jpg"} />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                    <h5 class="business-name">Hello There</h5>
                    <h5>Business Name</h5>
                    <h5>Distance to Business</h5> 
                    <h5>Business Address</h5>
                </div>
                <div class="business-barbers">

                </div>
            </div>
        )
    }
}

export default BusinessInfo;