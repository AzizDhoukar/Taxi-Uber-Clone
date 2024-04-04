import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import { Stomp, CompatClient, Client } from '@stomp/stompjs';
import axios, { AxiosError } from 'axios';

import MapButton from '../../components/MapButton';
import Button from '../../components/Button';
import MapComponent from '../../components/MapComponent/MapComponent';

import iconHome from '../../assets/home.png';
import iconHistory from '../../assets/history.png';
import iconCenter from '../../assets/map_center.png';

import * as S from './styles';

interface ILatLng {
  latitude: number;
  longitude: number;
}
interface Driver {
  id: number;
  lat: number;
  lon: number;
  name: string;
  phone: string;
}
const SERVER_URL = 'http://192.168.0.4';

const Map: React.FC = () => {
  const [latLng, setLatLng] = useState<ILatLng>({
    latitude: 35.82676,
    longitude: 10.63805,
  });

  const [pairedDriver, setPairedDriver] = useState<Driver | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([{id: 1, name: 'driver1', phone: '1234567890', lat: 35.82276, lon: 10.63605}, {id: 2, name: 'driver2', phone: '1234567890', lat: 35.82976, lon: 10.63805}, {id: 3, name: 'driver3', phone: '1234567890', lat: 35.82176, lon: 10.63505}]);

  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    phone: '1234567890',
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

    console.log('fetching location ' + JSON.stringify(currentLocation.timestamp));
    
    }; 
  
  const postLocation = async () => {
    const url = `${SERVER_URL}:8080/api/clients/location/${user.id}`
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
  };

  const requestTaxi = async () => {
    //send a request to the id of the clossest driver
    const Driver = await axios.get(`${SERVER_URL}:8080/api/clients/request/${user.id}`)
    .catch(error => {
        console.error('Error 3:', error);
    });
    setPairedDriver(Driver.data);
    console.log('Response from the server matching request:', Driver.data);
    console.log('new value of pairedDriver:', pairedDriver);
    updatePairedDriver();
  };
   
  const getAllDrivers = async () => {
    const response = await axios.get(`${SERVER_URL}:8080/api/drivers`) 
    .catch(error => {
      console.error('Error in getAllDrivers:', error);
    });
    //setDrivers(response.data);
  }; 

  const updatePairedDriver = async () => {
    const Driver = await axios.get(`${SERVER_URL}:8080/api/drivers/${pairedDriver.id}`)
    .catch((error: AxiosError) => {
        console.error('Error 4:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Server responded with status code:', error.response.status);
          console.error('Error data:', error.response.data);
      }
    });
    console.log('pairedDriver:', pairedDriver);
    setPairedDriver(Driver.data );
  };

  useEffect(() => {
    console.log('SERVER_URL:', SERVER_URL);
    askPermission();
    fetchLocation();
    postLocation();
    getAllDrivers();
    const interval = setInterval(() => {
      if(pairedDriver === null){
        console.log('no paired driver', pairedDriver);
      }else{
        updatePairedDriver();
      }
    }, 3000); // Repeat every n seconds
 
    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(interval);
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
      <MapComponent latLng={latLng} clients={drivers} mapRef={mapRef} />
 
      <S.WhereToContainer >
            <S.From>From: curent position</S.From>
            <S.ToContainer>
              <S.GreenDot />
              <S.To placeholder='Where to?'></S.To>
            </S.ToContainer>
      </S.WhereToContainer>

      <S.BottomContainer>
        <Button onPress={() => requestTaxi()}>Request Taxi</Button>
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
