import Head from 'next/head';
import styled from 'styled-components';
import Container from '../components/Container/Container';

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
        <Title>Timer</Title>
      </Container>
    </div>
  );
};

export default Home;
