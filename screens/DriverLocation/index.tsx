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
import marker from '../../assets/marker.png';
import customMapStyle from '../../mapstyle.json';

import * as S from './styles';
import axios from 'axios';

interface ILatLng {
  latitude: number;
  longitude: number;
} 

const SERVER_URL = 'http://192.168.0.4';

const DriverMap: React.FC = () => {
  const [latLng, setLatLng] = useState<ILatLng>({
    latitude: 35.82676,
    longitude: 10.63805,
  });
  const [driver, setDriver] = useState({
    id: 1,
    name: 'John Doe',
    phone: '1234567890'
  });

  const [SharingLocation, setSharingLocation] = useState(false);
  const [clients, setClients] = useState([{id: 1, name: 'client1', phone: '1234567890', lat: 35.82276, lon: 10.63605}, {id: 2, name: 'client2', phone: '1234567890', lat: 35.82976, lon: 10.63805}, {id: 3, name: 'client3', phone: '1234567890', lat: 35.82176, lon: 10.63505}]);

  const getAllClients = async () => {
    const response = await axios.get(`${SERVER_URL}:8080/api/clients`)
    .catch(error => {
      console.error('Error 1:', error);
    });
    console.log('Response from server get: ', response.data);
    //setClients(response.data);
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

    const subscription = await Location.watchPositionAsync(options, (location) => { //most of the time this is only called once
      let latitude = location.coords.latitude;
      let longitude = location.coords.longitude;
      setLatLng({ latitude, longitude })
      console.log('new location from subscribeToLocationUpdates, timestamp = ' + JSON.stringify(location.timestamp)); 
      
      //TO DO: Send location to server
      const url = `${SERVER_URL}:8080/api/drivers/location/${driver.id}`

      const locationData = {
        lat: latLng.latitude,
        lon: latLng.longitude 
      };
      axios.post(url, locationData)
      .then(response => {
          console.log('Response from server post:', response.data);
      })
      .catch(error => {
          console.error('Error 2:', error);
      });
      // Update the Client's location
      getAllClients();
    }); 
    // To stop receiving updates, you can call remove() on the subscription object.
    // subscription.remove();
  };

  useEffect(() => {
    askPermission();
    fetchLocation();
    getAllClients();
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
        {clients.map(client => (
          <Marker key={client.id}  coordinate={{latitude: client.lat, longitude: client.lon}} image={marker} tracksViewChanges={false}/>
        ))}
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
