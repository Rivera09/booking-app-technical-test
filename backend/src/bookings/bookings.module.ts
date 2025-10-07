import { Module } from '@nestjs/common';
import { BookingsService } from './services/bookings.service';
import { BookingsController } from './bookings.controller';
import { AuthModule } from '@/auth/auth.module';
import { GoogleCalendarService } from '@/auth/services/auth0-management.service';

@Module({
  imports: [AuthModule],
  providers: [BookingsService, GoogleCalendarService],
  controllers: [BookingsController],
})
export class BookingsModule {}
