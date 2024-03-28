import React, { useRef, MutableRefObject, RefObject } from 'react';
import { TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import CodeInput from '../../components/CodeInput';
import envelopeImg from '../../assets/envelope.png';

import * as S from './styles';

const Verification: React.FC = () => {
  const navigation = useNavigation();
  const codeRef2 = useRef(null);
  const codeRef3 = useRef(null);
  const codeRef4 = useRef(null);

  function focusNext(ref: RefObject<TextInput | null>) {
    ref.current?.focus();
  }

  return (
    <S.Container>
      <S.InnerContainer>
        <StatusBar style="dark" />
        <S.IconContainer>
          <S.Envelope source={envelopeImg} />
        </S.IconContainer>
        <S.Title>
          <S.Title>Verification </S.Title>
          <S.Title bold>Code</S.Title>
        </S.Title>
        <S.Description>
          <S.Description>
            Please type the verification code sent to
          </S.Description>
          <S.Description bold> +994 555 66 77</S.Description>
        </S.Description>
        <S.CodeContainer>
          <CodeInput autoFocus onChangeText={() => focusNext(codeRef2)} />
          <CodeInput ref={codeRef2} onChangeText={() => focusNext(codeRef3)} />
          <CodeInput ref={codeRef3} onChangeText={() => focusNext(codeRef4)} />
          <CodeInput
            returnKeyType="send"
            ref={codeRef4}
            onChangeText={() => navigation.navigate('CurrentLocation')}
            onSubmitEditing={() => navigation.navigate('CurrentLocation')}
          />
        </S.CodeContainer>
      </S.InnerContainer>
    </S.Container>
  );
};

export default Verification;
