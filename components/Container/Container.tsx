import styled from 'styled-components';
import Image from 'next/image';

const BackgroundContainer = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  z-index: -1;
`;

export const Background = () => (
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
);

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Background />
      <main>{children}</main>
    </div>
  );
};

export default Container;
