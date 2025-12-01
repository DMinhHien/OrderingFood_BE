import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Post,
  Body,
} from '@nestjs/common';
import { GeocodingService, GeocodingResult } from './geocoding.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('geocoding')
@Controller('geocoding')
export class GeocodingController {
  constructor(private readonly geocodingService: GeocodingService) {}

  @Get('reverse')
  @ApiOperation({ summary: 'Reverse geocode coordinates to address' })
  @ApiQuery({ name: 'lat', type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lng', type: Number, description: 'Longitude' })
  async reverseGeocode(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ): Promise<GeocodingResult> {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new BadRequestException('Latitude và Longitude phải là số hợp lệ');
    }

    if (latitude < -90 || latitude > 90) {
      throw new BadRequestException('Latitude phải trong khoảng -90 đến 90');
    }

    if (longitude < -180 || longitude > 180) {
      throw new BadRequestException('Longitude phải trong khoảng -180 đến 180');
    }

    return this.geocodingService.reverseGeocode(latitude, longitude);
  }

  @Post('directions')
  @ApiOperation({ summary: 'Get route from Google Maps Directions API' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        origin: {
          type: 'object',
          properties: {
            latitude: { type: 'number' },
            longitude: { type: 'number' },
          },
        },
        destination: {
          type: 'object',
          properties: {
            latitude: { type: 'number' },
            longitude: { type: 'number' },
          },
        },
        waypoints: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              latitude: { type: 'number' },
              longitude: { type: 'number' },
            },
          },
        },
      },
      required: ['origin', 'destination'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Route coordinates',
    schema: {
      type: 'object',
      properties: {
        polyline: { type: 'string' },
        coordinates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              latitude: { type: 'number' },
              longitude: { type: 'number' },
            },
          },
        },
      },
    },
  })
  async getDirectionsRoute(
    @Body()
    body: {
      origin: { latitude: number; longitude: number };
      destination: { latitude: number; longitude: number };
      waypoints?: Array<{ latitude: number; longitude: number }>;
    },
  ) {
    if (!body.origin || !body.destination) {
      throw new BadRequestException('Origin và Destination là bắt buộc');
    }

    if (
      typeof body.origin.latitude !== 'number' ||
      typeof body.origin.longitude !== 'number'
    ) {
      throw new BadRequestException(
        'Origin phải có latitude và longitude là số',
      );
    }

    if (
      typeof body.destination.latitude !== 'number' ||
      typeof body.destination.longitude !== 'number'
    ) {
      throw new BadRequestException(
        'Destination phải có latitude và longitude là số',
      );
    }

    return this.geocodingService.getDirectionsRoute(
      body.origin,
      body.destination,
      body.waypoints,
    );
  }
}
