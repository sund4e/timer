import styled from 'styled-components';
import { Page } from '../Page/Page';
import { Article } from '../../data/articles/index';
import Link from 'next/link';
import Button from '../Button/Button';

export const Title = styled.h1`
  font-size: 3rem;
  margin-top: 5rem;
`;

const ContentContainer = styled.div`
  h2 {
    font-size: 2rem;
    margin-top: 2rem;
    margin-bottom: 1.5rem;
  }

  h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0.5rem 0;
  }

  li {
    font-size: 1.1rem;
    line-height: 1.6;
  }

  ul,
  ol {
    list-style-position: inside;
    padding-left: 1rem;
    margin-bottom: 1rem;
    margin: 0;
  }

  strong {
    font-weight: 600;
  }

  a {
    color: ${({ theme }) => theme.colors.light};
  }
`;

const ActionButton = styled(Button)`
  font-size: 1.2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.light};
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    border: 1px solid white;
    color: white;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 2rem;
`;

const BackLink = styled(Link)`
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.colors.light};
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }
`;

interface ArticlePageProps {
  article: Article;
  canonicalUrl?: string;
  structuredData?: object;
  ogImage?: string;
}

const ArticlePage = ({
  article,
  canonicalUrl,
  structuredData,
  ogImage,
}: ArticlePageProps) => {
  return (
    <Page
      title={`${article.title} - Aika Timer`}
      description={article.description}
      canonicalUrl={canonicalUrl}
      structuredData={structuredData}
      ogImage={ogImage}
    >
      <Title>{article.title}</Title>
      <ContentContainer dangerouslySetInnerHTML={{ __html: article.content }} />
      <ActionsContainer>
        <Link href="/" passHref>
          <ActionButton>Go to Aika</ActionButton>
        </Link>
        <BackLink href="/articles">« Back to all articles</BackLink>
      </ActionsContainer>
    </Page>
  );
};

export default ArticlePage;
