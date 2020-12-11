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
        <meta
          name="description"
          content="Simple, yet beautiful online timer. Fullscreen countdown and ability
          to set recurring reminders. Free and no ads."
        />
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          defer
          data-website-id="f3044ce1-5436-4a7d-9477-15b05eb0e6ef"
          data-domains="aika.app"
          src="https://umami-kappa.vercel.app/umami.js"
        ></script>
      </Head>
      <Container>
        <TimerApp initialTime={0} isActive={true} />
      </Container>
    </div>
  );
};

export default Home;
