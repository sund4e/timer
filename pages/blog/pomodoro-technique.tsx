import styled from 'styled-components';
import Container from '../../components/Container';
import Head from 'next/head';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import Button from '../../components/Button/Button';

const BackButton = styled(Link)`
  position: fixed;
  top: 2rem;
  left: 2rem;
  color: white;
  font-size: 2rem;
  z-index: 10;
  display: flex;
  align-items: center;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.light};
  }
`;

const PostContainer = styled.div`
  padding: 4rem 2rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  max-width: 800px;
  margin: 2rem auto;
  border-radius: 8px;
  overflow-y: auto;
  height: calc(100% - 4rem);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const Subheading = styled.h2`
  font-size: 2rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const StyledList = styled.ul`
  list-style-position: inside;
  padding-left: 1rem;
  margin-bottom: 1rem;
`;

const ListItem = styled.li`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
`;

const ActionButton = styled(Button)`
  margin-top: 2rem;
  font-size: 1.2rem;
`;

const PomodoroPostPage = () => {
  return (
    <>
      <Head>
        <title>The Pomodoro Technique - Aika Timer</title>
      </Head>
      <BackButton href="/read-more">
        <IoIosArrowBack />
      </BackButton>
      <Container>
        <PostContainer>
          <Title>
            What Is the Pomodoro Technique and How to Use It for Better Focus
          </Title>

          <Subheading>What is the Pomodoro Technique?</Subheading>
          <Paragraph>
            The Pomodoro Technique is a time management strategy that breaks
            work into short, focused intervals. Traditionally, it&apos;s:
          </Paragraph>
          <StyledList>
            <ListItem>
              25 minutes of focused work (called a &quot;Pomodoro&quot;)
            </ListItem>
            <ListItem>5-minute break</ListItem>
            <ListItem>
              Repeat 4 times, then take a longer 15–30 minute break
            </ListItem>
          </StyledList>
          <Paragraph>
            This structure helps reduce mental fatigue and makes large tasks
            feel manageable.
          </Paragraph>
          <Paragraph>
            It was created by Francesco Cirillo in the late 1980s. The name
            &quot;Pomodoro&quot; comes from the tomato-shaped kitchen timer he
            used.
          </Paragraph>

          <Subheading>
            Why the Pomodoro Technique Works (Backed by Psychology)
          </Subheading>
          <Paragraph>1. It reduces procrastination</Paragraph>
          <Paragraph>
            Committing to just 25 minutes feels much easier than &quot;I need to
            write this whole paper&quot; or &quot;I have to finish this
            project.&quot; It&apos;s a way to trick your brain into starting.
          </Paragraph>
          <Paragraph>
            2. It matches your brain&apos;s natural focus rhythms
          </Paragraph>
          <Paragraph>
            Studies suggest that our brain can only focus deeply for short
            bursts — often around 20–30 minutes at a time. Pomodoro sessions
            work with this rhythm.
          </Paragraph>
          <Paragraph>3. It builds momentum</Paragraph>
          <Paragraph>
            Every completed Pomodoro feels like a small win. That sense of
            progress fuels motivation, especially when you&apos;re tired or
            overwhelmed.
          </Paragraph>
          <Paragraph>
            4. It helps manage ADHD and executive dysfunction
          </Paragraph>
          <Paragraph>
            People with ADHD often struggle with task initiation, attention
            switching, and time blindness. Pomodoro offers:
          </Paragraph>
          <StyledList>
            <ListItem>A visible, predictable structure</ListItem>
            <ListItem>Built-in breaks (which reduce burnout)</ListItem>
            <ListItem>An external time anchor</ListItem>
          </StyledList>

          <Subheading>How to Start Using Pomodoro (No Apps Needed)</Subheading>
          <Paragraph>
            You can literally just use a kitchen timer or a stopwatch app. But
            if you want a cleaner, more focused experience, there are minimalist
            Pomodoro timers that reduce distractions and help you get started
            fast.
          </Paragraph>

          <Subheading>How to use Aika for Pomodoro Technique:</Subheading>
          <Paragraph>
            Aika is a free, web-based Pomodoro timer. Here&apos;s how to set up
            a full session in under a minute:
          </Paragraph>
          <StyledList as="ol">
            <ListItem>Set your first 25-minute timer</ListItem>
            <ListItem>
              Add a 5-minute timer using the ➕ icon. This will be your break.
            </ListItem>
            <ListItem>
              Repeat to create 4 Pomodoro/break cycles. For the final timer, set
              a longer break (e.g. 30 minutes).
            </ListItem>
            <ListItem>
              Open the ⚙️ side menu to enable notifications and &quot;Restart
              timer when done.&quot;
            </ListItem>
            <ListItem>
              Press Start. When notified, alternate between focus and rest.
            </ListItem>
          </StyledList>
          <Paragraph>
            That&apos;s it! You&apos;ve set up a complete Pomodoro routine with
            no signup or download.
          </Paragraph>

          <Link href="/" passHref>
            <ActionButton as="a">Go to Aika</ActionButton>
          </Link>

          <Subheading>
            Final Thoughts: The Power Is in the Simplicity
          </Subheading>
          <Paragraph>
            The Pomodoro Technique isn&apos;t flashy and that&apos;s the point.
            It helps you return to the basics of focus: short, intense effort,
            followed by rest.
          </Paragraph>
          <Paragraph>
            Whether you&apos;re studying, coding, or trying to manage your time
            better with ADHD, Pomodoro can help. Tools like Aika can make it
            effortless to build the habit.
          </Paragraph>

          <Subheading>Frequently Asked Questions</Subheading>
          <Paragraph>How long is a Pomodoro session?</Paragraph>
          <Paragraph>
            Traditionally, 25 minutes of focused work followed by a 5-minute
            break.
          </Paragraph>
          <Paragraph>Do I need a special app to use Pomodoro?</Paragraph>
          <Paragraph>
            No. You can use any timer — though minimalist Pomodoro apps make it
            easier to automate breaks.
          </Paragraph>
          <Paragraph>Is Pomodoro good for ADHD?</Paragraph>
          <Paragraph>
            Yes. Its structure helps manage time blindness, overwhelm, and task
            switching.
          </Paragraph>
        </PostContainer>
      </Container>
    </>
  );
};

export default PomodoroPostPage;
