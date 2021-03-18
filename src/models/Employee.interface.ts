import { Appointment } from "./Appointment.interface";
import { Customer } from "./Customer.interface";
import { Review } from "./Review.interface";

export interface Employee {
    appointments: Appointment[];
    clients: Customer[];
    isOwner: boolean;
    reviews: Review[];
    todos: any[];
    services: any[];
    firstName?: string;
    id: string;
    position: string;
}