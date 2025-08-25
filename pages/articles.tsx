import styled from 'styled-components';
import { Page } from '../components/Page/Page';
import { articles } from '../data/articles/index';
import { Title as PageTitle } from '../components/ArticlePage/ArticlePage';
import Link from 'next/link';

const Title = styled(PageTitle)`
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-top: 4rem;
  }
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.8;
  margin-top: 1rem;
  margin-bottom: 3rem;
  max-width: 70ch;
`;

const PostList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem; /* Adds space between items */
`;

const PostItemContainer = styled.li`
  margin-bottom: 1.5rem;
  flex: 1 1 45%; /* Allows items to grow and shrink */
  min-width: 300px; /* Prevents items from becoming too narrow */
  border: 1px solid;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius}rem;
  transition: border-color 0.2s ease-in-out;

  @media (max-width: 768px) {
    flex-basis: 100%; /* Makes items full-width on mobile */
  }

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
    <Page title="Aika | Science-Backed Guides on Time Management & Productivity">
      <Title>Time, Well Spent: The Science of Focus and Productivity</Title>
      <SubTitle>
        Science-backed articles on using timers to boost focus, productivity,
        and wellbeing. Explore our guides and improve how you work, learn, and
        live.
      </SubTitle>
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
