import styled from 'styled-components';
import { useState, useEffect } from 'react';

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  background-color: #a2a8b3;
  background-image: url('./luirojarvi.jpg');
  background-size: cover;
  color: ${({ theme }) => theme.colors.primary};
`;

export default Container;
