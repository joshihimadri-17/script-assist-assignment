import { randomUUID } from 'node:crypto';
import type { Booking } from '../schemas/booking.schema';

export function createBookingData(): Booking {
  return {
    firstname: 'Framework',
    lastname: `Test-${randomUUID()}`,
    totalprice: 125,
    depositpaid: true,
    bookingdates: {
      checkin: '2030-01-10',
      checkout: '2030-01-12',
    },
    additionalneeds: 'Breakfast',
  };
}
