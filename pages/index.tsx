import Head from 'next/head';
import styled from 'styled-components';
import Container from '../components/Container';
import Timer from '../components/Timer';

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Home = () => {
  return (
    <div>
      <Head>
        <title>Timer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Title>
          <Timer startTime={10} onTimeEnd={() => console.log('END')} />
        </Title>
      </Container>
    </div>
  );
};

export default Home;
