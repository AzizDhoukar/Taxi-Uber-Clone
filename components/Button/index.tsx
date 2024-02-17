import React from 'react';
import { RectButtonProperties, GestureHandlerRootView } from 'react-native-gesture-handler';

import * as S from './styles';

interface IProps extends RectButtonProperties {
  children: React.ReactNode;
}

const Button: React.FC<IProps> = ({ children, ...props }) => {
  return (
    <GestureHandlerRootView>
      <S.Container {...props}>
        <S.ButtonText>{children}</S.ButtonText>
      </S.Container>
    </GestureHandlerRootView>
  );
};

export default Button;
