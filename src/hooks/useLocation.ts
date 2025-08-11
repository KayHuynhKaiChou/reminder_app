import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from 'react-native-geolocation-service';

export const useLocation = () => {
    async function requestLocationPermission() {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    }

    async function getLocation(): Promise<Geolocation.GeoPosition | null> {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) return null;

        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position) => resolve(position),
                (error) => {
                    console.error('Lỗi khi lấy vị trí:', error);
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                }
            );
        });
    }

    const reverseGeocodeWithLocationIQ = async (latitude: number, longitude: number) => {
        const API_KEY = process.env.API_KEY_LOCATION_IQ; // 👈 thay bằng token của bạn
        const url = `https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${latitude}&lon=${longitude}&format=json`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const address = data.display_name;
            return address;
        } catch (error) {
            console.error('Lỗi reverse geocode:', error);
            return null;
        }
    };


    return { getLocation, reverseGeocodeWithLocationIQ };
}