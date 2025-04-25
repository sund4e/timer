import Head from 'next/head';
import styled from 'styled-components';
import Container from '../components/Container';
import TimerApp from '../components/TimerApp';
import { useState } from 'react';
import { getHms } from '../components/TimeInput';

const twoDigitNumber = (number: number) => {
  return number < 10 ? `0${number}` : number;
};

const toTimeString = (seconds: number) => {
  const hms = getHms(seconds);
  return `${
    hms.hours > 0 ? `${twoDigitNumber(hms.hours)}:` : ''
  }${twoDigitNumber(hms.minutes)}:${twoDigitNumber(hms.seconds)}`;
};

const Home = () => {
  const [time, setTime] = useState(0);
  return (
    <div>
      <Head>
        <title>{`${toTimeString(time)} - Aika Timer`}</title>
        <meta
          name="description"
          content="Simple, yet beautiful online timer. Fullscreen countdown and ability
          to set recurring reminders. Free and no ads."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <TimerApp initialTime={0} isActive={true} setTitleTime={setTime} />
      </Container>
    </div>
  );
};

export default Home;
