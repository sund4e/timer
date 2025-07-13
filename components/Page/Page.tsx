import styled from 'styled-components';
import Container from '../Container';
import Head from 'next/head';
import Logo from '../Logo/Logo';

const Header = styled.header`
  position: fixed;
  top: 2rem;
  left: 5rem;
  z-index: 10;
`;

const PostContainer = styled.div`
  padding: 5rem;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: left;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  opacity: 0.8;
`;

export const Page = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header>
        <Logo />
      </Header>
      <Container>
        <PostContainer>{children}</PostContainer>
      </Container>
    </>
  );
};
