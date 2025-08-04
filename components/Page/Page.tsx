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
  padding: 5rem 20rem;
  color: ${({ theme }) => theme.colors.light};
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: ${({ theme }) => theme.colors.primary};
  opacity: 0.8;
  box-sizing: border-box;
  min-height: 100vh;
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
