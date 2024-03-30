import React, { useEffect, useState } from 'react';
import { Alert, View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import { Stomp, CompatClient, Client, Versions } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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
  const [client, setClient] = useState<Client>();

  const connect = () => {
    console.log('connecting')
    // const socket  = new WebSocket('ws://localhost:8080/driverLocation'); //wss://echo.websocket.org  for testing
    // setSocket(socket);
    // socket.onopen = () => { 
    //   console.log('WebSocket connection established (from driver)');
    // };
    // socket.onerror = (error) => {
    //   console.log('WebSocket error ' , error);
    // };
    const client = new Client({ 
      brokerURL: 'ws://192.169.0.4:8080/clientLocation',
      onConnect: () => {
        console.log('Connected to STOMP broker');
        client.subscribe('/app/track/client', message =>
          console.log(`Received: ${message.body}`)
        );
        client.publish({ destination: '/app/track/client', body: 'First Message' });
      },
    });
    client.activate();

    client.onDisconnect = (frame) => {
      console.log('Disconnected from STOMP broker');
    };
    client.onStompError = (frame) => {
      console.error('STOMP protocol error:', frame.body);
    };  
    client.debug = (str) => {
      console.log(str);
    };
  };
  
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

    console.log('fetch location, timestamp = ' + JSON.stringify(currentLocation.timestamp));
  };

  const options = {
    accuracy: Location.Accuracy.High,
    timeInterval: 1000, // Update interval in milliseconds (1 second)
    distanceInterval: 10, // Minimum distance in meters that must be traveled for an update
  }; 

  const subscribeToLocationUpdates = async () => {
    setSharingLocation(true);

    const subscription = await Location.watchPositionAsync(options, (location) => {
    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;
    setLatLng({ latitude, longitude })
    console.log('new location from subscribeToLocationUpdates, timestamp = ' + JSON.stringify(location.timestamp)); 
    
    //TO DO: Send location to server
    //socket.send(JSON.stringify(location.coords));
    // socket.onerror = (error) => {
    //   console.log('WebSocket error in subscribeToLocationUpdates ' , error);
    // };

    }); 
    // To stop receiving updates, you can call remove() on the subscription object.
    // subscription.remove();
  };

  useEffect(() => {
    askPermission();
    fetchLocation();
    connect();
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
        <Button onPress={() => {setSharingLocation(false); console.log('sharing = false')}}>Stop Working</Button>
      ) : (
        <Button onPress={() => subscribeToLocationUpdates()}>Start Working</Button>
      )}
      </S.BottomContainer>
    </S.Container>
  );
};

export default DriverMap;
