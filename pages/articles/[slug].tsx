import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import ArticlePage from '../../components/ArticlePage/ArticlePage';
import { articles, Article } from '../../data/articles';

interface PostProps {
  article?: Article;
}

const Post = ({ article }: PostProps) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!article) {
    return <p>Article not found.</p>;
  }

  return <ArticlePage article={article} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = articles.map((article) => ({
    params: { slug: article.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const article = articles.find((p) => p.slug === params?.slug);

  return {
    props: { article },
  };
};

export default Post;
