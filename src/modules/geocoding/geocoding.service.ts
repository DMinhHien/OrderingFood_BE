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
}
