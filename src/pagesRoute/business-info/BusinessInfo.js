import React, { Component } from 'react';
import { CarouselItem, CarouselCaption, Carousel, CarouselControl, CarouselIndicators } from 'reactstrap';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { Rating } from '@material-ui/lab';
import { Avatar, CircularProgress } from '@material-ui/core';

import { firestore } from '../../config/FirebaseConfig';

import './BusinessInfo.css';

class BusinessInfo extends Component {

    constructor(props) {
        super(props);
        this.state = { 
          activeIndex: 0,
          business: undefined
        };
        this.nextImg = this.nextImg.bind(this);
        this.prevImg = this.prevImg.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
    }

    componentDidMount() {
      firestore.collection('businesses').onSnapshot(snapshot => {
        const selectedBusiness = snapshot.docs[0].data();

        this.setState({
          business: selectedBusiness
        })
        console.log(selectedBusiness);
      })
    }

    onExiting() {
        this.animating = true;
    }

    onExited() { 
        this.animating = false;
    }

    nextImg() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }
  
    prevImg() {
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
              <img src={item.src} alt={item.altText} className="d-block w-100"/>
              <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
            </CarouselItem>
          );
        });


        return (
          <div class="business-info-page">
            {this.state.business !== undefined ? (
                <div class="business-overview">
                  <div class="carousel-container">
                      <Carousel
                          activeIndex={activeIndex}
                          next={this.nextImgButton}
                          previous={this.prevImgButton}
                      >
                          <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                          {slides}
                          <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.prevImg} />
                          <CarouselControl direction="next" directionText="Next" onClickHandler={this.nextImg} />
                      </Carousel>
                  </div>

                  <div class="business-information">
                    <h5 class="business-name">{this.state.business.businessName}</h5>
                    <h6>{this.state.business.address}, {this.state.business.city}, {this.state.business.state} {this.state.business.zipcode}</h6>
                    <div class="distance-container">
                      <LocationOnIcon />
                      <p class="distance-to-business">0.02 Mi</p> 
                    </div>
                  </div>
                  
                  <div class="about-business">
                    <h6><b>ABOUT US</b></h6>
                    <div class="about-content">{this.state.business.aboutBusiness}</div>
                  </div>

                  <div class="reviews-container">
                    <div class="overall-review">
                      <h6><b>REVIEWS</b></h6>
                      <Rating 
                        size="medium"
                        value={this.state.business.businessRating} 
                        precision={0.5}
                        readOnly
                      />
                    </div>

                    <div>
                      <div class="business-review">
                        <div class="review-avatar">
                          <Avatar />
                        </div>
                        <div class="review-content">
                          <div><b>Melissa</b></div>
                          <div>Brought my son for a haircut and it was perfect! He loved it and we will definitely be making another appointment</div>
                        </div>
                        <div class="review-rating">
                          <div>10/17/20</div>
                          <Rating
                            size="small"
                            value={2.5}
                            precision={0.5}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            ) : (
              <div class='loading-container'>
                <CircularProgress size={75} />
              </div>
            )
          }
          </div>
        )
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