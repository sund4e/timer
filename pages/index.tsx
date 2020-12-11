import Head from 'next/head';
import styled from 'styled-components';
import Container from '../components/Container';
import useTimer from '../hooks/useTimer';
import TimerApp from '../components/TimerApp';

const Home = () => {
  return (
    <div>
      <Head>
        <title>Aika Timer</title>
        <meta name="description">
          Simple, yet beautiful online timer. Fullscreen countdown and ability
          to set recurring reminders. Free and no ads.
        </meta>
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
