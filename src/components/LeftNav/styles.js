import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const Wrap = styled.div`
  width: 220px;
  padding: 10px 0px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  overflow-y: scroll;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0px;
  }
`;

export const Item = styled(NavLink)`
  display: flex;
  flex-shrink: 0;
  height: 50px;
  width: 100%;
  align-items: center;
  padding-right: 20px;
  box-sizing: border-box;
  cursor: pointer;
  justify-content: end;
  color: #656464;
  text-decoration: none;

  &:hover {
    background: #fdf2ed;
    color: #000;
  }
`;
