import styled from 'styled-components';
import { Page } from '../components/Page/Page';
import { articles } from '../data/articles/index';
import Link from 'next/link';

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

const PostItemContainer = styled.li`
  margin-bottom: 1.5rem;
  flex: 0 0 auto;
  width: 45%;
  border: 1px solid;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius}rem;
  transition: border-color 0.2s ease-in-out;

  &:hover {
    border-color: white;
    h3,
    p {
      color: white;
      opacity: 1;
    }
  }
`;

const PostLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.light};

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    transition: color 0.2s ease-in-out;
  }

  p {
    font-size: 1rem;
    opacity: 0.8;
    transition:
      color 0.2s ease-in-out,
      opacity 0.2s ease-in-out;
  }
`;

const ArticlesPage = () => {
  return (
    <Page title="Aika - Articles on Productivity, Time Management, and Wellbeing">
      <Title>
        Master Your Time: Timers That Boost Focus, Productivity, and Wellbeing
      </Title>
      <PostList>
        {articles.map((article) => (
          <PostItemContainer key={article.slug}>
            <PostLink href={`/articles/${article.slug}`}>
              <h3>{article.title}</h3>
              <p>{article.abstract}</p>
            </PostLink>
          </PostItemContainer>
        ))}
      </PostList>
    </Page>
  );
};

export default ArticlesPage;
