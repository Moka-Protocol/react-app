import styled from 'styled-components';

export const Wrap = styled.a`
  height: 60px;
  border-bottom: 1px solid #f7f7f7;
  cursor: pointer;
  padding: 10px 15px;
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  color: inherit;
`;

export const Vote = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 65px;
  margin-left: auto;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Reward = styled.div`
  margin-left: auto;
  margin-right: 15px;
  display: flex;
  align-items: center;
`;