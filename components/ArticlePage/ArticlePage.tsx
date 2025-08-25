import styled from 'styled-components';
import { Page } from '../Page/Page';
import { Article } from '../../data/articles';
import Link from 'next/link';
import Button from '../Button/Button';

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
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
`;

const ActionButton = styled(Button)`
  margin-top: 2rem;
  font-size: 1.2rem;
`;

interface ArticlePageProps {
  article: Article;
}

const ArticlePage = ({ article }: ArticlePageProps) => {
  return (
    <Page title={`${article.title} - Aika Timer`}>
      <Title>{article.title}</Title>
      <ContentContainer dangerouslySetInnerHTML={{ __html: article.content }} />
      <Link href="/" passHref>
        <ActionButton as="a">Go to Aika</ActionButton>
      </Link>
    </Page>
  );
};

export default ArticlePage;
