import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import {  Media, Card, CardBody, CardHeader } from 'reactstrap';
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

                <div class="business-barbers container-fluid" style={{background:'#212423'}}>
                    
                    <div className="row col-md-6 offset-md-3">
                        <Card style={{ width: '100%' }}>
                            <CardHeader style={{background:'#212423'}}>Map of our location:</CardHeader>
                            <CardBody style={{ height: '18rem'}}>

                            </CardBody>
                        </Card>
                    </div>
        
                    <div className="row row-content">
                        <div className="row col-md-6 offset-md-3">
                            <h2>Barbers:</h2>
                        </div>
                        <div className="row col-md-6 offset-md-3">
                            <Media list>
                                <Media tag="li">
                                    <Media left middle>
                                        <Media object width={120} height= {120} src={"assets/profile1.jpg"} alt={"profile1"} />
                                    </Media>
                                    <Media body className="text-left ml-3">
                                    <Media heading>Name one</Media>
                                        <p>
                                            Ullamco reprehenderit commodo incididunt qui consequat laboris consectetur. Eu occaecat sit ad amet ad minim anim ullamco laboris ullamco exercitation. Cillum occaecat et elit aute veniam ipsum velit tempor et Lorem do tempor. Irure culpa ullamco duis amet Lorem dolor excepteur aliqua exercitation. Est anim laborum pariatur elit sunt sunt aute aliqua cupidatat consectetur in amet duis. Ullamco ex qui esse est sit reprehenderit amet dolor aliqua.
                                        </p>
                                    </Media>
                                </Media>
                                <Media tag="li">
                                    <Media left middle >
                                        <Media object width={120} height= {120} src={"assets/profile2.jpg"} alt={"profile2"} />
                                    </Media>
                                    <Media body className="text-left ml-3">
                                        <Media heading>Name two</Media>
                                        <p>
                                            Anim Lorem Lorem in voluptate reprehenderit minim aliquip. Ipsum labore in reprehenderit ea laborum enim laborum laboris. Qui minim consectetur sunt in culpa est irure. Quis occaecat aliquip proident irure culpa culpa et anim id. Do in ad minim do ullamco magna cillum laboris. Laborum labore consequat sunt ipsum ad adipisicing eiusmod duis aliquip exercitation deserunt anim laboris dolore. Id quis laborum occaecat esse mollit.
                                        </p>
                                    </Media>
                                </Media>
                                <Media tag="li">
                                    <Media left middle>
                                        <Media object width={120} height= {120} src={"assets/profile3.jpg"} alt={"profile3"} />
                                    </Media>
                                    <Media body className="text-left ml-3">
                                        <Media heading>Name three</Media>
                                        <p>
                                            Aute ad qui dolor est aliqua occaecat non consequat officia adipisicing velit duis ea. Exercitation aliqua et elit ut qui esse deserunt deserunt officia non cupidatat consectetur mollit. Magna officia ullamco occaecat quis. Eiusmod amet pariatur Lorem anim fugiat incididunt id. Tempor minim elit eu in ex nulla dolore occaecat exercitation minim in dolor. Id reprehenderit excepteur culpa minim irure in Lorem enim officia enim cillum esse ullamco dolore.
                                        </p>
                                    </Media>
                                </Media>
                            </Media> 
                        </div>     
                    </div>
                </div>
            </div>
        )
    }
}

export default BusinessInfo;