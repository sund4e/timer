import styled from 'styled-components';
import Image from 'next/image';

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

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <BackgroundContainer>
        <Image
          alt="Sokosti"
          src="/sokosti_small.jpg"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority={true}
        />
        <Image
          alt="Sokosti"
          src="/sokosti.jpg"
          layout={'fill'}
          objectFit="cover"
          quality={100}
        />
      </BackgroundContainer>
      <MainContainer>{children}</MainContainer>
    </div>
  );
};

export default Container;
