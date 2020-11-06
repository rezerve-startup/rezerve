import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Carousel, CarouselItem, CarouselCaption, CarouselControl, CarouselIndicators } from 'reactstrap';
import './BusinessInfo.css'


const items = [
    {
      src: 'assets/cat1.jpg',
      altText: '',
      caption: ''
    },
    {
      src: 'assets/cat2.jpg',
      altText: '',
      caption: ''
    },
    {
      src: 'assets/cat3.jpg',
      altText: '',
      caption: ''
    }
  ];
  
  class BusinessInfo extends Component {
    constructor(props) {
      super(props);
      this.state = { activeIndex: 0 };
      this.next = this.next.bind(this);
      this.previous = this.previous.bind(this);
      this.goToIndex = this.goToIndex.bind(this);
      this.onExiting = this.onExiting.bind(this);
      this.onExited = this.onExited.bind(this);
    }
  
    onExiting() {
      this.animating = true;
    }
  
    onExited() {
      this.animating = false;
    }
  
    next() {
      if (this.animating) return;
      const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
      this.setState({ activeIndex: nextIndex });
    }
  
    previous() {
      if (this.animating) return;
      const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
      this.setState({ activeIndex: nextIndex });
    }
  
    goToIndex(newIndex) {
      if (this.animating) return;
      this.setState({ activeIndex: newIndex });
    }
  
    render() {
      const { activeIndex } = this.state;
  
      const slides = items.map((item) => {
        return (
          <CarouselItem
            className="carouselImg"
            onExiting={this.onExiting}
            onExited={this.onExited}
            key={item.src}
          >
            <img src={item.src} alt={item.altText} />
            <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
          </CarouselItem>
        );
      });
  
      return (
            <div class="business-info-page">
                <div class="business-overview">
                    <div class="carousel-container">
                        <Carousel
                            activeIndex={activeIndex}
                            next={this.next}
                            previous={this.previous}
                            >
                            <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                            {slides}
                            <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                            <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
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
                      <div className="barbertable row col-md-6 offset-md-3">
                        <table>
                          
                          <thead>
                            <tr>
                              <th><h4>Barbers:</h4></th>
                              <th></th>
                            </tr>
                          </thead>
                          
                          <tbody>
                            <tr>
                              <td id="left">
                                <img className="img-fluid col-12 rounded" src={"assets/profile1.jpg"}></img>
                                <Button variant="light">Name One</Button>
                              </td>
                              <td>
                                <img className="img-fluid col-12 rounded" src={"assets/profile2.jpg"}></img>
                                <Button variant="light">Name Two</Button>
                              </td>
                            </tr>
                            <tr>
                              <td id="left">
                                <img className="img-fluid col-12 rounded" src={"assets/profile3.jpg"}></img>
                                <Button variant="light">Name Three</Button>
                              </td>
                              <td>
                                <img className="img-fluid col-12 rounded" src={"assets/profile4.jpg"}></img>
                                <Button variant="light">Name Four</Button>
                              </td>
                            </tr>
                          </tbody>
                        
                        </table>
                      </div>       
                    </div>
                </div>
            </div>
      );
    }
  }
  
  
  export default BusinessInfo;