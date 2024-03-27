import styled from 'styled-components/native';
import MapView from 'react-native-maps';
import { RectButton } from 'react-native-gesture-handler';

import { ThemeProps } from '../../theme';

export const Container = styled.View`
  flex: 1;
  alignItems : center;
`;

export const Map = styled(MapView)`
  width: 100%;
  height: 100%;
`;

export const OptionsContainer = styled.View`
  position: absolute;
  flex-direction: column;
  alignSelf : flex-end;
  bottom: 40px;
  padding-right: 20px;
`;

export const LeftOptions = styled.View`
  flex-direction: row;
`;

export const WhereToContainer = styled.View<ThemeProps>`
  position: absolute;
  justify-content: center;
  top: 45px;
  width: 90%;
  height: 55px;
  border: 1px solid ${({ theme }) => theme.color.gray};
  background: #fff;
  border-radius: 45px;
  padding: 0 23px;
`;

export const BottomContainer = styled.View`
  position: absolute;
  flex-direction: column;
  alignSelf : flex-end;
  bottom: 45px;
  right: 90px;
`;



export const WhereToButton = styled(RectButton)`
  justify-content: center;
  background: #fff;
  border-radius: 45px;
`;

export const From = styled.Text<ThemeProps>`
  font-family: ${({ theme }) => theme.font.regular};
  font-size: 10px;
  color: ${({ theme }) => theme.color.primary};
`;

export const ToContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const GreenDot = styled.View<ThemeProps>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.color.secondary};
  margin-right: 10px;
`;

export const To = styled.TextInput<ThemeProps>`
  font-family: ${({ theme }) => theme.font.regular};
  font-size: 18px;
  color: ${({ theme }) => theme.color.primary};
`;