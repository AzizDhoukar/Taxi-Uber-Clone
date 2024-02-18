import styled from 'styled-components/native';
import MapView from 'react-native-maps';

import { ThemeProps } from '../../theme';

export const Container = styled.View`
  flex: 1;
`;

export const HeaderContainer = styled.View`
  position: absolute;
  z-index: 999;
`;

export const Map = styled(MapView)`
  flex: 1;
`;

export const Bottom = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10% 10% 30px 10%;
`;
