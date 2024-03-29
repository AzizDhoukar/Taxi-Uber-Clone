import React, { useState } from 'react';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Polyline, Marker, Callout } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import homeMarker from '../../assets/home_marker.png';
import destMarker from '../../assets/dest_marker.png';
import customMapStyle from '../../mapstyle.json';

import Header from '../../components/Header';
import Button from '../../components/Button';
import theme from '../../theme';

import * as S from './styles';

const Request: React.FC = () => {

  const navigation = useNavigation();

  return (
    <S.Container>
      <S.HeaderContainer>
        <Header transparentButton={false} />
      </S.HeaderContainer>
      <S.Map
        region={{
          latitude: -19.920183,
          longitude: -43.936825,
          latitudeDelta: 0.0143,
          longitudeDelta: 0.0134,
        }}
        loadingEnabled
        showsCompass={false}
        showsPointsOfInterest={false}
        showsBuildings={false}
        customMapStyle={customMapStyle}
      >
        <Polyline
          coordinates={[
            { longitude: -43.935129, latitude: -19.916483 },
            { longitude: -43.935322, latitude: -19.917199 },
            { longitude: -43.935452, latitude: -19.917306 },
            { longitude: -43.935597, latitude: -19.917413 },
            { longitude: -43.936989, latitude: -19.918178 },
            { longitude: -43.938683, latitude: -19.919081 },
            { longitude: -43.937698, latitude: -19.920745 },
            { longitude: -43.938009, latitude: -19.921849 },
            { longitude: -43.938881, latitude: -19.921655 },
          ]}
          strokeColor={theme.color.secondary} // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={4}
        />
        <Marker
          image={homeMarker}
          coordinate={{ latitude: -19.916483, longitude: -43.935129 }}
        >
          <Callout>
            <Text>Praça da Estação</Text>
          </Callout>
        </Marker>
        <Marker
          image={destMarker}
          coordinate={{ latitude: -19.921655, longitude: -43.938881 }}
        >
          <Callout>
            <Text>Igreja de São José</Text>
          </Callout>
        </Marker>
      </S.Map>

      <S.Bottom>
        <LinearGradient
          colors={['rgba(255,255,255, 0.2)', 'rgba(255,255,255, 0.9)', '#fff']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 300,
          }}
        />
        <GestureHandlerRootView>
          <Button onPress={() => navigation.navigate('YourRide')}>
            Send Request
          </Button>
        </GestureHandlerRootView>
      </S.Bottom>
    </S.Container>
  );
};

export default Request;
