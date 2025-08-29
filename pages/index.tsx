import Head from 'next/head';
import Container from '../components/Container';
import TimerApp from '../components/TimerApp';
import { useState, useEffect } from 'react';
import { getHms } from '../components/TimeInput';

const APP_NAME = 'Aika';
const APP_DEFAULT_TITLE = 'Minimalist Online Timer | Aika';
const APP_DESCRIPTION =
  'Aika is a distraction-free online timer with fullscreen countdowns and desktop notifications. Perfect for Pomodoro, meetings, and the 20-20-20 rule. Free and ad-free.';
const APP_URL = 'https://aika.app';
const APP_IMAGE_PREVIEW = '/preview.png';

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

  useEffect(() => {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: toTimeString(time),
      artist: 'Aika Timer',
    });
  }, [time]);

  return (
    <>
      <Head>
        <title>
          {time > 0 ? `${toTimeString(time)} | ${APP_NAME}` : APP_DEFAULT_TITLE}
        </title>
        <meta name="description" content={APP_DESCRIPTION} />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta
          name="keywords"
          content="online timer, countdown timer, pomodoro timer, meeting timer, 20-20-20 rule, minimalist timer, fullscreen timer, free timer, no ads"
        />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={APP_URL} />
        <meta property="og:title" content={APP_DEFAULT_TITLE} />
        <meta property="og:description" content={APP_DESCRIPTION} />
        <meta
          property="og:image"
          content={`${APP_URL}${APP_IMAGE_PREVIEW}`}
        />{' '}
        {/* Needs absolute URL for og:image */}
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={APP_URL} />
        <meta property="twitter:title" content={APP_DEFAULT_TITLE} />
        <meta property="twitter:description" content={APP_DESCRIPTION} />
        <meta
          property="twitter:image"
          content={`${APP_URL}${APP_IMAGE_PREVIEW}`}
        />{' '}
        {/* Needs absolute URL for twitter:image */}
        {/* Canonical URL */}
        <link rel="canonical" href={APP_URL} />
        {/* More specific viewport, though _document.tsx has one already */}
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"></meta> */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: APP_DEFAULT_TITLE,
              description: APP_DESCRIPTION,
              url: APP_URL,
              applicationCategory: 'Utilities',
              operatingSystem: 'All', // Web app is OS-independent
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
      </Head>
      <Container>
        <TimerApp initialTime={0} isActive={true} setTitleTime={setTime} />
      </Container>
    </>
  );
};

export default Home;
