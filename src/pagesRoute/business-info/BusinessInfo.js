import React, { Component } from 'react';
import { CarouselItem, CarouselCaption, Carousel, CarouselControl, CarouselIndicators } from 'reactstrap';
import './BusinessInfo.css';

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
                <div class="business-barbers">

                </div>
            </div>
        );
    }
}

const items = [
    {
        src: 'assets/cat1.jpg',
        altText: '',
        caption: ''
      },
      {
        src: 'assets/cat2.jpg',
        altText: '',
        caption: 'Freedom Isn\'t Free'
      },
      {
        src: 'assets/cat4.jpg',
        altText: '',
        caption: ''
      }
];

export default BusinessInfo;