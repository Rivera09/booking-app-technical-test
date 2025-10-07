import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleCalendarService } from './services/auth0-management.service';
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, GoogleCalendarService],
  exports: [PassportModule, GoogleCalendarService],
})
export class AuthModule {}
