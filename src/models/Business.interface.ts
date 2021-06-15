import firebase from 'firebase';
import { Employee } from './Employee.interface';
import { Review } from './Review.interface';

export interface Business {
    about: {
        address: string;
        city: string;
        closingTime: string;
        location: firebase.firestore.GeoPoint
        openingTime: string;
        daysOpen: string[];
        state: string;
        zipcode: string;
    };
    coverImage: string;
    description: string;
    employees: any[];
    name: string;
    numWorkers: number;
    performance: Performance[];
    overallRating: number;
    reviews: Review[];
    type: string;
}

export interface Performance {
    date: firebase.firestore.Timestamp;
    type: string;
}
