import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

import { ThemeProps } from '../../theme';

export const Container = styled(RectButton)`
  align-items: center;
  justify-content: center;
  width: 110px;
  background: ${({ theme }: ThemeProps) => theme.color.primary};
  height: 55px;
  border-radius: 8px;
`;

export const ButtonText = styled.Text<ThemeProps>`
  font-family: ${({ theme }) => theme.font.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.color.white};
`;
