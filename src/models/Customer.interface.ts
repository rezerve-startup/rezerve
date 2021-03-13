import { Appointment } from "./Appointment.interface";
import { Review } from "./Review.interface";

export interface Customer {
    appointments: Appointment[];
    reviews: Review[];
}