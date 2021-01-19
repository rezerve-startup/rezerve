import React from 'react';
// import { CarouselItem, CarouselCaption, Carousel, CarouselControl, CarouselIndicators } from '../../customer/customer-signup/node_modules/reactstrap';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { Rating } from '@material-ui/lab';
import { Avatar, CircularProgress } from '@material-ui/core';

import { firestore } from '../../config/FirebaseConfig';

import './BusinessInfo.css';

type MyState = {
  animating: boolean
  activeIndex: number
  business: any
}

class BusinessInfo extends React.Component<{}, MyState> {

    constructor(props: any) {
        super(props);
        this.state = { 
          animating: false,
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
      this.setState({
        animating: true
      })
    }

    onExited() { 
      this.setState({
        animating: false
      })
    }

    nextImg() {
        if (this.state.animating) return;
        const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }
  
    prevImg() {
        if (this.state.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }
  
    goToIndex(newIndex: number) {
        if (this.state.animating) return;
        this.setState({ activeIndex: newIndex });
    }
  
    render() {
        // const activeIndex = this.state.activeIndex;

        // const slides = items.map((item) => {
          // return (
          //   <CarouselItem
          //     classNameName="carouselImg"
          //     onExiting={this.onExiting}
          //     onExited={this.onExited}
          //     key={item.src}
          //   >
          //     <img src={item.src} alt={item.altText} classNameName="d-block w-100"/>
          //     <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
          //   </CarouselItem>
          // );
        // });


        return (
          <div className="business-info-page">
            {this.state.business !== undefined ? (
                <div className="business-overview">
                  <div className="carousel-container">
                      {/* <Carousel
                          activeIndex={activeIndex}
                          next={this.nextImgButton}
                          previous={this.prevImgButton}
                      >
                          <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                          {slides}
                          <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.prevImg} />
                          <CarouselControl direction="next" directionText="Next" onClickHandler={this.nextImg} />
                      </Carousel> */}
                  </div>

                  <div className="business-information">
                    <h5 className="business-name">{this.state.business.businessName}</h5>
                    <h6>{this.state.business.address}, {this.state.business.city}, {this.state.business.state} {this.state.business.zipcode}</h6>
                    <div className="distance-container">
                      <LocationOnIcon />
                      <p className="distance-to-business">0.02 Mi</p> 
                    </div>
                  </div>
                  
                  <div className="about-business">
                    <h6><b>ABOUT US</b></h6>
                    <div className="about-content">{this.state.business.aboutBusiness}</div>
                  </div>

                  <div className="reviews-container">
                    <div className="overall-review">
                      <h6><b>REVIEWS</b></h6>
                      <Rating 
                        size="medium"
                        value={this.state.business.businessRating} 
                        precision={0.5}
                        readOnly
                      />
                    </div>

                    <div>
                      <div className="business-review">
                        <div className="review-avatar">
                          <Avatar />
                        </div>
                        <div className="review-content">
                          <div><b>Melissa</b></div>
                          <div>Brought my son for a haircut and it was perfect! He loved it and we will definitely be making another appointment</div>
                        </div>
                        <div className="review-rating">
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
              <div className='loading-container'>
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