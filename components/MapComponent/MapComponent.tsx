import React from 'react';
import { Image } from 'react-native';
import { Marker } from 'react-native-maps';

import * as S from './styles';

import marker from '../../assets/marker.png';
import cab from '../../assets/cab.png';
import customMapStyle from '../../mapstyle.json';
interface Driver {
    id: number;
    lat: number;
    lon: number;
    name: string;
    phone: string;
  }
const MapComponent = ({ latLng, drivers, mapRef, pairedDriver }) => {
    return (
        <S.Map 
        ref={map => {
          mapRef = map;
        }}
        region={{
          ...latLng,
          latitudeDelta: 0.0143,
          longitudeDelta: 0.0134,
        }}
        loadingEnabled
        showsCompass={false}
        showsPointsOfInterest={false}
        showsBuildings={false}
        customMapStyle={customMapStyle}>
        <Marker coordinate={latLng} image={marker} tracksViewChanges={false}/>
        {pairedDriver == null ? <>
            {drivers.map((driver : Driver) => (
                <Marker key={driver.id} coordinate={{latitude: driver.lat, longitude: driver.lon}} tracksViewChanges={false}>
                    <Image source={cab} style={{ height: 50, width: 50 }} resizeMode="contain" />
                </Marker>
            ))}
        </> : <>
            <Marker key={pairedDriver.id} coordinate={{latitude: pairedDriver.lat, longitude: pairedDriver.lon}} tracksViewChanges={true}>
                <Image source={cab} style={{ height: 50, width: 50 }} resizeMode="contain" />
            </Marker>
        </>}
            
        </S.Map>
    );
};

export default MapComponent;
