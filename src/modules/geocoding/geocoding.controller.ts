import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { GeocodingService, GeocodingResult } from './geocoding.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

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
}
