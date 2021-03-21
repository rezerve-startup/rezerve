export interface Appointment {
  businessId: string;
  customerId;
  datetime: Date;
  employeeId: string;
  service: {
    name: string;
    length: number;
    price: number;
  }
}
