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
        state: string;
        zipcode: string;
    };
    coverImage: string;
    description: string;
    employees: any[];
    // employees: Employee[];
    name: string;
    numWorkers: number;
    performance: {
        abandonedCarts: number;
        bookingPercentage: number;
        profileViews: number;
        rating: number;
    };
    reviews: Review[];
}