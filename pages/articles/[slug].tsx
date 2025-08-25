import { GetStaticPaths, GetStaticProps } from 'next';
import { articles, Article } from '../../data/articles/index';
import ArticlePage from '../../components/ArticlePage/ArticlePage';

interface ArticleProps {
  article: Article;
}

const ArticlePost = ({ article }: ArticleProps) => {
  const canonicalUrl = `https://aika.app/articles/${article.slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: article.title,
    description: article.description,
    image: `https://aika.app${article.image || '/logo.png'}`,
    author: {
      '@type': 'Organization',
      name: 'Aika',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aika',
      logo: {
        '@type': 'ImageObject',
        url: 'https://aika.app/logo.png',
      },
    },
    datePublished: article.date,
  };

  return (
    <ArticlePage
      article={article}
      // @ts-ignore
      canonicalUrl={canonicalUrl}
      // @ts-ignore
      structuredData={structuredData}
      // @ts-ignore
      ogImage={article.image}
    />
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = articles.map((article) => ({
    params: { slug: article.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const article = articles.find((p) => p.slug === params?.slug);

  if (!article) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      article,
    },
    revalidate: 60, // Optional: Enables ISR
  };
};

export default ArticlePost;
