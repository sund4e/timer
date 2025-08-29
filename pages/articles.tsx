import styled from 'styled-components';
import { articles } from '../data/articles';
import { Page } from '../components/Page/Page';
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
  flex: 1 1 300px; /* Allow items to grow and shrink from a 300px base */
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
  color: inherit;
  display: block;
  height: 100%;
  -webkit-tap-highlight-color: transparent; /* Prevent tap highlight on iOS */

  &:active {
    text-decoration: none; /* Ensure no underline on active state */
  }

  h3 {
    margin-top: 0;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    transition: color 0.2s ease-in-out;
  }

  p {
    font-size: 1rem;
    opacity: 0.8;
    margin-bottom: 0rem;
    transition:
      color 0.2s ease-in-out,
      opacity 0.2s ease-in-out;
  }
`;

const ArticlesPage = () => {
  const pageTitle =
    'How to Use Timers: Science-Backed Guides for Focus & Productivity';
  const pageDescription =
    'A collection of science-backed guides on using timers to boost focus, productivity, and wellbeing. Learn how to work smarter, not harder.';
  const canonicalUrl = 'https://aika.app/articles';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${canonicalUrl}/${article.slug}`,
        name: article.title,
      })),
    },
  };

  return (
    <Page
      title={pageTitle}
      description={pageDescription}
      canonicalUrl={canonicalUrl}
      structuredData={structuredData}
    >
      <Title>
        How to Use Timers: Science-Backed Guides for Focus & Productivity
      </Title>
      <SubTitle>
        Explore our collection of guides on using timers to work smarter, learn
        faster, and improve your daily wellbeing.
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
