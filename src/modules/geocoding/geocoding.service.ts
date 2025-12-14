import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GeocodingResult {
  province: string;
  district: string;
  ward: string;
  formattedAddress: string;
}

@Injectable()
export class GeocodingService {
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('GOOGLE_MAPS_API_KEY') || '';
  }

  async reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<GeocodingResult> {
    if (!this.apiKey) {
      throw new Error('Google Maps API key chưa được cấu hình');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.apiKey}&language=vi`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        throw new Error('Không thể lấy thông tin địa chỉ từ tọa độ');
      }

      const result = data.results[0];
      const addressComponents = result.address_components;

      let province = '';
      let district = '';
      let ward = '';

      // Parse address components
      for (const component of addressComponents) {
        const types = component.types;

        if (types.includes('administrative_area_level_1')) {
          // Tỉnh/Thành phố
          province = component.long_name;
        } else if (
          types.includes('administrative_area_level_2') ||
          types.includes('sublocality_level_1')
        ) {
          // Quận/Huyện
          if (!district) {
            district = component.long_name;
          }
        } else if (
          types.includes('administrative_area_level_3') ||
          types.includes('sublocality_level_2') ||
          types.includes('ward')
        ) {
          // Phường/Xã
          if (!ward) {
            ward = component.long_name;
          }
        }
      }

      // Fallback nếu không tìm thấy
      if (!province) {
        province = 'Chưa xác định';
      }
      if (!district) {
        district = 'Chưa xác định';
      }
      if (!ward) {
        ward = 'Chưa xác định';
      }

      return {
        province,
        district,
        ward,
        formattedAddress: result.formatted_address,
      };
    } catch (error: any) {
      throw new Error(
        `Lỗi khi gọi Google Geocoding API: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async getDirectionsRoute(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
    waypoints?: Array<{ latitude: number; longitude: number }>,
  ): Promise<{
    polyline: string;
    coordinates: Array<{ latitude: number; longitude: number }>;
  }> {
    if (!this.apiKey) {
      throw new Error('Google Maps API key chưa được cấu hình');
    }

    // Validate coordinates
    if (
      origin.latitude < -90 ||
      origin.latitude > 90 ||
      origin.longitude < -180 ||
      origin.longitude > 180
    ) {
      console.warn(
        '[GeocodingService] Invalid origin coordinates, using fallback',
      );
      const fallbackCoords = [origin, ...(waypoints || []), destination];
      return {
        polyline: '',
        coordinates: fallbackCoords,
      };
    }

    if (
      destination.latitude < -90 ||
      destination.latitude > 90 ||
      destination.longitude < -180 ||
      destination.longitude > 180
    ) {
      console.warn(
        '[GeocodingService] Invalid destination coordinates, using fallback',
      );
      const fallbackCoords = [origin, ...(waypoints || []), destination];
      return {
        polyline: '',
        coordinates: fallbackCoords,
      };
    }

    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;
    const waypointsStr = waypoints
      ? waypoints.map((wp) => `${wp.latitude},${wp.longitude}`).join('|')
      : '';

    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&key=${this.apiKey}&language=vi`;
    if (waypointsStr) {
      url += `&waypoints=${waypointsStr}`;
    }

    console.log('[GeocodingService] Calling Google Maps Directions API:', {
      origin: originStr,
      destination: destinationStr,
      waypointsCount: waypoints?.length || 0,
    });

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log('[GeocodingService] Google Maps Directions API response:', {
        status: data.status,
        hasRoutes: !!(data.routes && data.routes.length > 0),
        errorMessage: data.error_message,
      });

      // Handle different response statuses
      if (data.status === 'ZERO_RESULTS') {
        console.warn(
          '[GeocodingService] ZERO_RESULTS - No route found, using fallback',
        );
        // No route found - return straight line coordinates as fallback
        const fallbackCoords = [origin, ...(waypoints || []), destination];
        return {
          polyline: '',
          coordinates: fallbackCoords,
        };
      }

      if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
        console.warn(
          `[GeocodingService] API error: ${data.status}, using fallback`,
        );
        // For other errors, also return fallback
        const fallbackCoords = [origin, ...(waypoints || []), destination];
        return {
          polyline: '',
          coordinates: fallbackCoords,
        };
      }

      const route = data.routes[0];
      const polyline = route.overview_polyline?.points;

      if (!polyline) {
        console.warn('[GeocodingService] No polyline in route, using fallback');
        // Fallback if no polyline
        const fallbackCoords = [origin, ...(waypoints || []), destination];
        return {
          polyline: '',
          coordinates: fallbackCoords,
        };
      }

      // Decode polyline to coordinates
      const coordinates = this.decodePolyline(polyline);

      console.log('[GeocodingService] Route decoded successfully:', {
        polylineLength: polyline.length,
        coordinatesCount: coordinates.length,
        firstPoint: coordinates[0],
        lastPoint: coordinates[coordinates.length - 1],
      });

      return {
        polyline,
        coordinates,
      };
    } catch (error: any) {
      console.error(
        '[GeocodingService] Error calling Google Directions API:',
        error,
      );
      // On any error, return fallback coordinates
      const fallbackCoords = [origin, ...(waypoints || []), destination];
      return {
        polyline: '',
        coordinates: fallbackCoords,
      };
    }
  }

  private decodePolyline(
    encoded: string,
  ): Array<{ latitude: number; longitude: number }> {
    const poly: Array<{ latitude: number; longitude: number }> = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b: number;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      poly.push({
        latitude: lat * 1e-5,
        longitude: lng * 1e-5,
      });
    }

    return poly;
  }
}
