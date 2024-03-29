import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';

import MapButton from '../../components/MapButton';
import Button from '../../components/Button';

import iconHome from '../../assets/home.png';
import iconHistory from '../../assets/history.png';
import iconCenter from '../../assets/map_center.png';
import marker from '../../assets/marker.png';
import customMapStyle from '../../mapstyle.json';

import * as S from './styles';

interface ILatLng {
  latitude: number;
  longitude: number;
}

const Map: React.FC = () => {
  const [latLng, setLatLng] = useState<ILatLng>({
    latitude: 35.82676,
    longitude: 10.63805,
  });

  const navigation = useNavigation();
  let mapRef: MapView | null = null;

  const askPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    // Permission granted, you can now access location
  };
  const fetchLocation = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({});
    let latitude = currentLocation.coords.latitude;
    let longitude = currentLocation.coords.longitude;
    setLatLng({ latitude, longitude })

    console.log(JSON.stringify(currentLocation));
  };

  useEffect(() => {
    askPermission();
    fetchLocation();
    //setLatLng({ latitude: 35.82676, longitude: 10.63805 });
  }, []);

  function centerMap() {
    mapRef?.animateToRegion(
      {
        ...latLng,
        latitudeDelta: 0.0143,
        longitudeDelta: 0.0134,
      },
      1000,
    );
  }

  return (
    <S.Container>
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
        customMapStyle={customMapStyle}
      >
        <Marker coordinate={latLng} image={marker} tracksViewChanges={false}/>
      </S.Map>

      <S.WhereToContainer >
            <S.From>From: curent position</S.From>
            <S.ToContainer>
              <S.GreenDot />
              <S.To placeholder='Where to?'></S.To>
            </S.ToContainer>
      </S.WhereToContainer>

      <S.BottomContainer>
        <Button onPress={() => navigation.navigate('Request')}>Request Taxi</Button>
      </S.BottomContainer>

      <S.OptionsContainer>
        <GestureHandlerRootView>
          <MapButton icon={iconHome} />
          <MapButton icon={iconHistory} />
          <MapButton icon={iconCenter} onPress={centerMap} />
        </GestureHandlerRootView>
      </S.OptionsContainer>
          
    </S.Container>
  );
};

export default Map;
