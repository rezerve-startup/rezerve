export type Business = {
  about: About;
  coverImage: string;
  description: string;
  employees: string[],
  name: string;
  numWorkers: number;
  performance: Performance;
  reviews: string[];
}

interface About {
  address: string;
  city: string;
  state: string;
  zipcode: string;
  daysOpen: string[];
  location: [string, string]
  openingTime: string;
  closingTime: string;
}

interface Performance {
  abandonedCarts: number;
  bookingPercentage: number;
  profileViews: number;
  rating: number;
}