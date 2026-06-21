import React from 'react';
import { View, Platform } from 'react-native';

// react-native-maps has type issues with React 19, so we use require() with type casting
let MapView: any = null;
let Polyline: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default || Maps.MapView;
    Polyline = Maps.Polyline;
    Marker = Maps.Marker;
  } catch (e) {
    console.warn('react-native-maps not available:', e);
  }
}

interface RouteMapProps {
  routeCoords: { latitude: number; longitude: number }[];
}

export function RouteMap({ routeCoords }: RouteMapProps) {
  if (!MapView || routeCoords.length === 0 || Platform.OS === 'web') {
    return null;
  }

  const latestCoord = routeCoords[routeCoords.length - 1];

  return (
    <MapView
      style={{ width: '100%', height: 200, borderRadius: 16 }}
      initialRegion={{
        latitude: routeCoords[0]?.latitude || -6.2088,
        longitude: routeCoords[0]?.longitude || 106.8456,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      region={{
        latitude: latestCoord.latitude,
        longitude: latestCoord.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      showsUserLocation={false}
      scrollEnabled={false}
      zoomEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
    >
      {routeCoords.length > 1 && Polyline && (
        <Polyline
          coordinates={routeCoords}
          strokeColor="#10B981"
          strokeWidth={4}
        />
      )}
      {Marker && (
        <Marker
          coordinate={latestCoord}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: '#10B981',
            borderWidth: 2,
            borderColor: 'white',
          }} />
        </Marker>
      )}
    </MapView>
  );
}