import styled from 'styled-components';
import { useState, useEffect, forwardRef } from 'react';
import Image from 'next/image';
// import sokosti from '../../public/sokosti.jpg';

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  color: ${({ theme }) => theme.colors.primary};
`;

const BackgroundContainer = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  z-index: -1;
`;

//background-image: url(${({ image }: { image: string }) => image});

const Container = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      <BackgroundContainer>
        <Image
          alt="Sokosti"
          src={'/sokosti.jpg'}
          onLoad={() => setIsLoading(true)}
          layout={'fill'}
          objectFit="cover"
          loading={'eager'}
          quality={100}
        />
      </BackgroundContainer>
      {isLoading ? <MainContainer>{children}</MainContainer> : 'loading...'}
    </div>
  );
};

export default Container;
