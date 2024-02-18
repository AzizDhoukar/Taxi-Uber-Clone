import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import PhoneInput from '../../components/PhoneInput';
import Button from '../../components/Button';

import cabImg from '../../assets/cab.png';
import * as S from './styles';

function Home() {
  const navigation = useNavigation();

  return (
    <S.Container>
      <StatusBar style="light" />
      <S.TopArea>
        <S.CabImg source={cabImg} resizeMode="contain" />
      </S.TopArea>
      <S.BottomArea>
        <S.Title>
          <S.Title>Welcome to </S.Title>
          <S.TitleBold>Wasalni</S.TitleBold>
        </S.Title>
        <PhoneInput placeholder="55 652 435" />
        <Button onPress={() => navigation.navigate('CurrentLocation')}>
          Get Started
        </Button>
      </S.BottomArea>
    </S.Container>
  );
};

export default Home;
