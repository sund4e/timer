import Head from 'next/head';
import styled from 'styled-components';
import Container from '../components/Container';
import useTimer from '../hooks/useTimer';
import TimerApp from '../components/TimerApp';

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Home = () => {
  const handleEnd = () => {
    console.log('END');
  };
  // const time = useTimer(10, handleEnd);
  return (
    <div>
      <Head>
        <title>Timer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        {/* <Title>{time}</Title> */}
        <TimerApp initialTime={0} isActive={true} />
      </Container>
    </div>
  );
};

export default Home;
