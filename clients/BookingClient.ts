import type { APIRequestContext, APIResponse } from '@playwright/test';
import { z } from 'zod';
import {
  BookingSchema,
  BookingTokenSchema,
  CreatedBookingSchema,
  type Booking,
} from '../schemas/booking.schema';

export interface BookingCredentials {
  readonly username: string;
  readonly password: string;
}

export class BookingClient {
  private tokenPromise: Promise<string> | undefined;

  constructor(
    private readonly request: APIRequestContext,
    private readonly credentials: BookingCredentials,
  ) {}

  async authenticate(): Promise<string> {
    this.tokenPromise ??= this.createToken();
    return this.tokenPromise;
  }

  async createBooking(booking: Booking): Promise<{ id: number; booking: Booking }> {
    const response = await this.request.post('/booking', { data: booking });
    const result = await this.parseResponse(response, CreatedBookingSchema, 'Create booking');
    return { id: result.bookingid, booking: result.booking };
  }

  async getBooking(id: number): Promise<Booking> {
    const response = await this.request.get(`/booking/${id}`);
    return this.parseResponse(response, BookingSchema, `Get booking ${id}`);
  }

  async updateBooking(id: number, booking: Booking): Promise<Booking> {
    const token = await this.authenticate();
    const response = await this.request.put(`/booking/${id}`, {
      data: booking,
      headers: { Cookie: `token=${token}` },
    });
    return this.parseResponse(response, BookingSchema, `Update booking ${id}`);
  }

  async patchBooking(id: number, changes: Partial<Booking>): Promise<Booking> {
    const token = await this.authenticate();
    const response = await this.request.patch(`/booking/${id}`, {
      data: changes,
      headers: { Cookie: `token=${token}` },
    });
    return this.parseResponse(response, BookingSchema, `Patch booking ${id}`);
  }

  async deleteBooking(id: number): Promise<void> {
    const token = await this.authenticate();
    const response = await this.request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
    if (!response.ok()) {
      throw new Error(
        `Delete booking ${id} failed with status ${response.status()}: ${await response.text()}`,
      );
    }
  }

  async deleteBookingIfPresent(id: number): Promise<void> {
    const response = await this.request.get(`/booking/${id}`);
    if (response.status() === 404) {
      return;
    }

    if (!response.ok()) {
      throw new Error(
        `Check booking ${id} before cleanup failed with status ${response.status()}: ${await response.text()}`,
      );
    }

    await this.deleteBooking(id);
  }

  private async createToken(): Promise<string> {
    const response = await this.request.post('/auth', {
      data: this.credentials,
    });
    const result = await this.parseResponse(
      response,
      BookingTokenSchema,
      'Authenticate with Restful Booker',
    );
    return result.token;
  }

  private async parseResponse<T>(
    response: APIResponse,
    schema: z.ZodType<T>,
    operation: string,
  ): Promise<T> {
    if (!response.ok()) {
      throw new Error(
        `${operation} failed with status ${response.status()}: ${await response.text()}`,
      );
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch (error) {
      throw new Error(`${operation} returned invalid JSON.`, { cause: error });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      throw new Error(
        `${operation} returned an invalid response: ${z.prettifyError(parsed.error)}`,
      );
    }

    return parsed.data;
  }
}
