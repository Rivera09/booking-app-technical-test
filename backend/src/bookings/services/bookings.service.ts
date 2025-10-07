import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@/primsa/prisma.service';
import { Booking } from '@prisma/client';
import { GoogleCalendarService } from '@/auth/services/auth0-management.service';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private prisma: PrismaService,
    private googleCalendarService: GoogleCalendarService,
  ) {}

  async checkConflict(startTime: Date, endTime: Date): Promise<boolean> {
    const conflict = await this.prisma.booking.findFirst({
      where: {
        OR: [
          {
            startTime: { lte: endTime },
            endTime: { gte: startTime },
          },
        ],
      },
    });
    return !!conflict;
  }

  async createBooking(
    userId: string,
    name: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Booking> {
    const hasLocalConflict = await this.checkConflict(startTime, endTime);
    if (hasLocalConflict) {
      throw new BadRequestException(
        'Booking conflicts with existing bookings in database',
      );
    }

    let googleAccessToken: string;
    try {
      googleAccessToken =
        await this.googleCalendarService.getGoogleAccessToken(userId);
    } catch (error) {
      this.logger.warn(
        'No se pudo obtener token de Google, continuando sin verificación de calendario:',
        error.message,
      );
      return this.prisma.booking.create({
        data: {
          auth0UserId: userId,
          name,
          startTime,
          endTime,
        },
      });
    }

    const calendarCheck =
      await this.googleCalendarService.checkCalendarConflicts(
        googleAccessToken,
        startTime,
        endTime,
      );

    if (calendarCheck.hasConflict) {
      const conflictDetails = calendarCheck
        .conflictingEvents!.map(
          (event) => `- ${event.summary} (${event.start} - ${event.end})`,
        )
        .join('\n');

      throw new BadRequestException(
        `Booking conflicts with existing events in Google Calendar:\n${conflictDetails}`,
      );
    }

    const booking = await this.prisma.booking.create({
      data: {
        auth0UserId: userId,
        name,
        startTime,
        endTime,
      },
    });

    return booking;
  }

  getUserBookings(userId: string): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { auth0UserId: userId },
      orderBy: { startTime: 'asc' },
    });
  }

  async cancelBooking(bookingId: string, userId: string): Promise<void> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking || booking.auth0UserId !== userId) {
      throw new BadRequestException('Booking not found or not allowed');
    }

    await this.prisma.booking.delete({ where: { id: bookingId } });
  }
}
