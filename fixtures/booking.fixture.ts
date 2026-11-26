import { test as base } from '@playwright/test';
import { BookingClient } from '../clients/BookingClient';
import { environment } from '../config/environment';
import { createBookingData } from '../test-data/booking-data';

type BookingFixtureData = {
  id: number;
  booking: Awaited<ReturnType<BookingClient['getBooking']>>;
};

type BookingFixtures = {
  bookingClient: BookingClient;
  booking: BookingFixtureData;
};

export const test = base.extend<BookingFixtures>({
  bookingClient: async ({ request }, use) => {
    const credentials = environment.credentials.booking;
    if (!credentials) {
      throw new Error(
        'RESTFUL_BOOKER_USERNAME and RESTFUL_BOOKER_PASSWORD are required for API tests.',
      );
    }

    await use(new BookingClient(request, credentials));
  },
  booking: async ({ bookingClient }, use) => {
    const created = await bookingClient.createBooking(createBookingData());
    try {
      await use(created);
    } finally {
      await bookingClient.deleteBookingIfPresent(created.id);
    }
  },
});

export { expect } from '@playwright/test';
