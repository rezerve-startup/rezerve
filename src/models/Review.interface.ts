import firebase from 'firebase';

export interface Review {
    businessId: string;
    customerId: string;
    date: firebase.firestore.Timestamp;
    employeeId: string;
    message: string;
    rating: number;
    poster?: string;
}