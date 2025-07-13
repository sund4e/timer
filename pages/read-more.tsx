import styled from 'styled-components';
import Container from '../components/Container';
import Head from 'next/head';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';

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

const ReadMoreContainer = styled.div`
  padding: 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  opacity: 0.8;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const PostList = styled.ul`
  list-style: none;
  padding: 0;
  text-align: center;
`;

const PostItem = styled.li`
  margin-bottom: 1.5rem;
`;

const PostLink = styled.a`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.light};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ReadMorePage = () => {
  return (
    <>
      <Head>
        <title>About- Aika Timer</title>
      </Head>
      <BackButton href="/">
        <IoIosArrowBack />
      </BackButton>
      <Container>
        <ReadMoreContainer>
          <Title>About Aika</Title>
          <PostList>
            <PostItem>
              <PostLink href="#" target="_blank" rel="noopener noreferrer">
                The Science of Productivity: How Timers Can Help
              </PostLink>
            </PostItem>
            <PostItem>
              <PostLink href="#" target="_blank" rel="noopener noreferrer">
                Mastering the Pomodoro Technique
              </PostLink>
            </PostItem>
            <PostItem>
              <PostLink href="#" target="_blank" rel="noopener noreferrer">
                Why Taking Breaks is Crucial for Your Eyes (20-20-20 Rule)
              </PostLink>
            </PostItem>
            <PostItem>
              <PostLink href="#" target="_blank" rel="noopener noreferrer">
                The Story Behind Aika Timer
              </PostLink>
            </PostItem>
          </PostList>
        </ReadMoreContainer>
      </Container>
    </>
  );
};

export default ReadMorePage;
