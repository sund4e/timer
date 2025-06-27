import styled from 'styled-components';

const Grid = styled.div`
  padding: 5px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
`;

export const Box = styled(Grid)`
  flex-wrap: wrap;
  justify-content: start;
`;

Box.displayName = 'Box';
