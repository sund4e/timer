import styled from 'styled-components';
import Container from '../Container';
import Head from 'next/head';
import Logo from '../Logo/Logo';

const Header = styled.header`
  padding-bottom: 3rem;

  @media (max-width: 768px) {
    padding-bottom: 1rem;
  }
`;

const PostContainer = styled.div`
  color: ${({ theme }) => theme.colors.light};
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: ${({ theme }) => theme.colors.primary};
  opacity: 0.8;
  box-sizing: border-box;
  min-height: 100vh;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 15rem 5rem;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem 3rem;
  }
`;

type PageProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  structuredData: object;
  ogImage?: string;
  canonicalUrl?: string;
};

export const Page = ({
  title,
  description,
  children,
  structuredData,
  ogImage,
  canonicalUrl,
}: PageProps) => {
  const siteName = 'Aika';
  const ogImageUrl = `https://aika.app${ogImage || '/logo.png'}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

        {/* Open Graph Tags */}
        <meta property="og:title" content={title} />
        {description && (
          <meta property="og:description" content={description} />
        )}
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:site_name" content={siteName} />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="article" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        {description && (
          <meta name="twitter:description" content={description} />
        )}
        <meta name="twitter:image" content={ogImageUrl} />

        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}
      </Head>
      <Container>
        <PostContainer>
          <Header>
            <Logo />
          </Header>
          {children}
        </PostContainer>
      </Container>
    </>
  );
};
