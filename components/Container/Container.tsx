import styled from 'styled-components';
import { useState, useEffect } from 'react';

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  background-color: #a2a8b3;
  background-image: url(${({ image }: { image: any }) => image});
  background-size: cover;
  color: ${({ theme }) => theme.colors.primary};
`;

const Container = ({ children }: { children: React.ReactNode }) => {
  const [imageUrl, setImageUrl] = useState('./luirojarvi_small.jpg');
  useEffect(() => {
    setImageUrl('./luirojarvi.jpg');
  }, []);
  return <StyledContainer image={imageUrl}>{children}</StyledContainer>;
};

export default Container;
