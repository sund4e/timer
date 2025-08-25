import styled from 'styled-components';
import { Page } from '../components/Page/Page';

const Title = styled.h1`
  font-size: 3rem;
  margin-top: 5rem;
`;

const PostList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const PostItem = styled.li`
  margin-bottom: 1.5rem;
  flex: 0 0 auto;
  width: 45%;
  border: 1px solid;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius}rem;
  &:hover {
    color: white;
    a {
      color: white;
    }
  }
`;

const PostLink = styled.a`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.light};
  text-decoration: none;
`;

const ReadMorePage = () => {
  return (
    <Page
      title="Aika - Articles about how timers can help in life and science behind
          it"
    >
      <Title>
        Master Your Time: Timers That Boost Focus, Productivity, and Wellbeing
      </Title>
      <PostList>
        <PostItem>
          <PostLink
            href="/articles/pomodoro-technique"
            rel="noopener noreferrer"
          >
            What Is the Pomodoro Technique and How to Use It for Better Focus
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
    </Page>
  );
};

export default ReadMorePage;
