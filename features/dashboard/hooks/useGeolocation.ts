
import { useState, useEffect } from 'react';
import type { GpsPosition, GpsError } from '../../../types';

const useGeolocation = (
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  },
) => {
  const [position, setPosition] = useState<GpsPosition | null>(null);
  const [error, setError] = useState<GpsError | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by your browser.',
      });
      setIsAvailable(false);
      return;
    }

    setIsAvailable(true);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          speed: pos.coords.speed,
          timestamp: pos.timestamp,
        });
        setError(null);
      },
      (err) => {
        setError({
          code: err.code,
          message: err.message,
        });
      },
      options,
    );

    // Cleanup function to clear the watch when the component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return { position, error, isAvailable };
};

export default useGeolocation;
