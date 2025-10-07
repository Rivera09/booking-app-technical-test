import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
  }

  async getGoogleAccessToken(auth0UserId: string): Promise<string> {
    try {
      const managementToken = await this.getAuth0ManagementToken();

      const response = await axios.get(
        `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0UserId)}`,
        {
          headers: {
            Authorization: `Bearer ${managementToken}`,
          },
        },
      );

      const googleIdentity = response.data.identities?.find(
        (identity: any) => identity.provider === 'google-oauth2',
      );

      if (!googleIdentity?.access_token) {
        throw new HttpException(
          'Google token not found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return googleIdentity.access_token;
    } catch (error) {
      this.logger.error('Error obteniendo Google access token:', error.message);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Google credentials error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getAuth0ManagementToken(): Promise<string> {
    try {
      const response = await axios.post(
        `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        {
          client_id: process.env.AUTH0_MGMT_CLIENT_ID,
          client_secret: process.env.AUTH0_MGMT_CLIENT_SECRET,
          audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
          grant_type: 'client_credentials',
        },
      );

      return response.data.access_token;
    } catch (error) {
      this.logger.error('Auth0 Management API error:', error.message);
      throw new HttpException(
        'Auth0 authentication error.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkCalendarConflicts(
    googleAccessToken: string,
    startTime: Date,
    endTime: Date,
  ): Promise<{ hasConflict: boolean; conflictingEvents?: any[] }> {
    try {
      this.oauth2Client.setCredentials({
        access_token: googleAccessToken,
      });

      const calendar = google.calendar({
        version: 'v3',
        auth: this.oauth2Client,
      });

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      const conflictingEvents = events.filter((event) => {
        if (!event.start || !event.end) return false;

        const eventStartStr = event.start.dateTime || event.start.date;
        const eventEndStr = event.end.dateTime || event.end.date;

        if (!eventStartStr || !eventEndStr) return false;

        const eventStart = new Date(eventStartStr);
        const eventEnd = new Date(eventEndStr);

        return eventStart < endTime && eventEnd > startTime;
      });

      if (conflictingEvents.length > 0) {
        return {
          hasConflict: true,
          conflictingEvents: conflictingEvents.map((event) => ({
            id: event.id,
            summary: event.summary,
            start: event.start?.dateTime || event.start?.date,
            end: event.end?.dateTime || event.end?.date,
            description: event.description,
          })),
        };
      }

      return { hasConflict: false };
    } catch (error) {
      this.logger.error(
        'Error verificando conflictos en Google Calendar:',
        error.message,
      );

      if (error.code === 401 || error.message?.includes('invalid_grant')) {
        throw new HttpException(
          'Google token expired.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        'Google calendar conflict check error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
