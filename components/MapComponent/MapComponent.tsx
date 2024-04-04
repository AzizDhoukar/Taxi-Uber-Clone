import React from 'react';
import { Image } from 'react-native';
import { Marker } from 'react-native-maps';

import * as S from './styles';

import marker from '../../assets/marker.png';
import cab from '../../assets/cab.png';
import customMapStyle from '../../mapstyle.json';

const MapComponent = ({ latLng, clients, mapRef }) => {
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
            <Marker coordinate={latLng} tracksViewChanges={false}>
                <Image source={cab} style={{ height: 50, width: 50 }} resizeMode="contain" />
            </Marker>
            {clients.map(client => (
                <Marker key={client.id}  coordinate={{latitude: client.lat, longitude: client.lon}} image={marker} tracksViewChanges={false}/>
            ))}
        </S.Map>
    );
};

export default MapComponent;
