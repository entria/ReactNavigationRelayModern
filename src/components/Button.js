//@flow
import React from 'react';
import styled from 'styled-components/native';

const Wrapper = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 50;
  border-bottom-left-radius: 20;
  border-bottom-right-radius: 20;
  border-top-left-radius: 20;
  border-top-right-radius: 20;
  margin-top: 20;
  background-color: #42a5f5;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonText = styled.Text`
  color: #000;
  font-size: 32px;
  font-weight: 700;
`

const Button = (props: Object) => (
  <Wrapper onPress={() => props.onPress()}>
    {props.children}
  </Wrapper>
);

export default Button;
