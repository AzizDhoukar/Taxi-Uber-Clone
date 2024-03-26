import React, { useState } from 'react';

import Header from '../../components/Header';
import Button from '../../components/Button';

import avatar from '../../assets/avatar.png';

import * as S from './styles';

const YourRide: React.FC = () => {
  const [rating, setRating] = useState(4);

  return (
    <>
      <Header title="Your Ride" />
      <S.Container>
        <S.InnerContainer>
          <S.InfoContainer>
            <S.Description>Your ride is</S.Description>
            <S.Description value>$5.58</S.Description>
            <S.Description>March 21, 2020 at 10:30 a.m</S.Description>
          </S.InfoContainer>
          <S.DriverContainer>
            <S.RatingContainer>
              <S.Description>Rate your driver</S.Description>

              <S.MessageInput
                multiline
                numberOfLines={1}
                placeholder="Your message..."
              />
            </S.RatingContainer>
            <Button style={{ paddingHorizontal: 20 }}>Done</Button>
          </S.DriverContainer>
        </S.InnerContainer>
      </S.Container>
    </>
  );
};

export default YourRide;
