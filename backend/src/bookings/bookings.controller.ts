import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './services/bookings.service';
import type { Request } from 'express';

class CreateBookingDto {
  name: string;
  startTime: string;
  endTime: string;
}

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  async create(@Req() req: Request, @Body() body: CreateBookingDto) {
    const { name, startTime, endTime } = body;
    const user = req.user as any;

    return this.bookingsService.createBooking(
      user.sub,
      name,
      new Date(startTime),
      new Date(endTime),
    );
  }

  @Get()
  async list(@Req() req: Request) {
    const user = req.user as any;

    return this.bookingsService.getUserBookings(user.sub);
  }

  @Delete(':id')
  async cancel(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any;

    await this.bookingsService.cancelBooking(id, user.sub);

    return { message: 'Booking canceled' };
  }
}
