import { expect, test } from '../../fixtures/booking.fixture';
test('authenticates and receives a token @smoke @restful-booker', async ({ bookingClient }) => {
  await expect(bookingClient.authenticate()).resolves.toBeTruthy();
});

test('creates and reads a schema-valid booking @smoke @restful-booker', async ({
  booking,
  bookingClient,
}) => {
  await expect(bookingClient.getBooking(booking.id)).resolves.toEqual(booking.booking);
});

test('updates a booking with PUT @regression @restful-booker', async ({
  booking,
  bookingClient,
}) => {
  const updatedBooking = {
    ...booking.booking,
    firstname: 'Updated',
    lastname: 'ByPut',
  };

  await expect(bookingClient.updateBooking(booking.id, updatedBooking)).resolves.toMatchObject(
    updatedBooking,
  );
});

test('partially updates a booking with PATCH @regression @restful-booker', async ({
  booking,
  bookingClient,
}) => {
  const changes = { firstname: 'Patched' };

  await expect(bookingClient.patchBooking(booking.id, changes)).resolves.toMatchObject({
    ...booking.booking,
    ...changes,
  });
});

test('deletes a booking @regression @restful-booker', async ({
  booking,
  bookingClient,
  request,
}) => {
  await bookingClient.deleteBooking(booking.id);

  const response = await request.get(`/booking/${booking.id}`);
  expect(response.status()).toBe(404);
});

test('rejects an invalid authentication token @regression @restful-booker', async ({
  booking,
  request,
}) => {
  const response = await request.patch(`/booking/${booking.id}`, {
    data: { firstname: 'Unauthorized' },
    headers: { Cookie: 'token=invalid-token' },
  });

  expect(response.status()).toBe(403);
});

test('returns an internal server error for a malformed booking payload @regression @restful-booker', async ({
  request,
}) => {
  const response = await request.post('/booking', {
    data: { firstname: 'Incomplete booking' },
  });

  expect(response.status()).toBe(500);
  expect(response.headers()['content-type']).toContain('text/plain');
  await expect(response.text()).resolves.toBe('Internal Server Error');
});

test('returns not found for a non-existent booking @regression @restful-booker', async ({
  request,
}) => {
  const response = await request.get(`/booking/${Number.MAX_SAFE_INTEGER}`);

  expect(response.status()).toBe(404);
});
