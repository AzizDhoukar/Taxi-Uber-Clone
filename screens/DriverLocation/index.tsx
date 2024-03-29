import React, { useEffect, useState } from 'react';
import { Alert, View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import MapButton from '../../components/MapButton';
import Button from '../../components/Button';

import iconHome from '../../assets/home.png';
import iconHistory from '../../assets/history.png';
import iconCenter from '../../assets/map_center.png';
import cab from '../../assets/cab.png';
import customMapStyle from '../../mapstyle.json';

import * as S from './styles';

interface ILatLng {
  latitude: number;
  longitude: number;
}

const DriverMap: React.FC = () => {
  const [latLng, setLatLng] = useState<ILatLng>({
    latitude: 35.82676,
    longitude: 10.63805,
  });

  const [SharingLocation, setSharingLocation] = useState(false);

  // const connect = () => {
  //   const socket  = new WebSocket('http://localhost:8080/websocket');
    
  //   socket.onopen = () => {      // connection opened
  //     socket.send('connected to driver'); // send a message
  //   };
  //   const client = Stomp.over(socket);
  //   client.connect({}, (frame) => {
  //     console.log('Connected: ' + frame);
  //     client.subscribe('/track/client', (clientLocation) => {//clintLocation is the call back from the server
  //       console.log(JSON.parse(clientLocation.body));
  //     });
  //   });
  // };

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

  const options = {
    accuracy: Location.Accuracy.High,
    timeInterval: 1000, // Update interval in milliseconds (1 second)
    distanceInterval: 10, // Minimum distance in meters that must be traveled for an update
  }; 

  const subscribeToLocationUpdates = async () => {
    setSharingLocation(true);
    try {
      const subscription = await Location.watchPositionAsync(options, (location) => {
      let latitude = location.coords.latitude;
      let longitude = location.coords.longitude;
      setLatLng({ latitude, longitude })
      console.log('new location' + JSON.stringify(location.coords)); 
      
      //TO DO: Send location to server

      });
      // To stop receiving updates, you can call remove() on the subscription object.
      // subscription.remove();
    } catch (error) {
      console.error('Error subscribing to location updates:', error);
    }
  };

  useEffect(() => {
    askPermission();
    fetchLocation();
    //connect();
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
        <Marker coordinate={latLng} tracksViewChanges={false}>
          <Image source={cab} style={{ height: 50, width: 50 }} resizeMode="contain" />
        </Marker>
      </S.Map>

      <S.OptionsContainer>
        <GestureHandlerRootView>
          <MapButton icon={iconHome} />
          <MapButton icon={iconHistory} />
          <MapButton icon={iconCenter} onPress={centerMap} />
        </GestureHandlerRootView>
      </S.OptionsContainer>
      
      <S.BottomContainer>
      {SharingLocation ? (
        <Button onPress={() => setSharingLocation(false)}>Stop Working</Button>
      ) : (
        <Button onPress={() => subscribeToLocationUpdates()}>Start Working</Button>
      )}
      </S.BottomContainer>
    </S.Container>
  );
};

export default DriverMap;
