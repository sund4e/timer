import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.light};
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const Logo = () => {
  return (
    <LogoContainer href="/">
      <Image src="/logo.png" alt="Aika Timer Logo" width={32} height={32} />
      <LogoText>Aika</LogoText>
    </LogoContainer>
  );
};

export default Logo;
