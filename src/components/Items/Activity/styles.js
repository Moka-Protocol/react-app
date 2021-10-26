import styled from 'styled-components';

export const Wrap = styled.div`
  border-bottom: 1px solid #f7f7f7;
  cursor: pointer;
  padding: 15px 10px 15px 20px;
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  color: inherit;
`;

export const Left = styled.div`

`;

export const User = styled.a`
  background: #f3f3f3;
  padding: 2px 4px;
  border-radius: 5px;
  text-decoration: none;
  color: inherit;
  transition: 0.5s;
  font-weight: normal;

  &:hover {
    background: #e9e9e9;
  }
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50px;
  margin-left: auto;
  flex-shrink: 0;
`;