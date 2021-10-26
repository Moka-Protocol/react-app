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
  position: fixed;
  top: 0px;
  left: calc((100% - 1000px) / 2 - 220px);
  overflow-y: scroll;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0px;
  }

  @media (max-width: 1440px) {
    left: calc((100% - 800px) / 2 - 220px);
  }

  @media (max-width: 1280px) {
    left: calc((100% - 500px) / 2 - 220px);
  }

  @media (max-width: 1000px) {
    display: none;
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
  justify-content: flex-end;
  color: #656464;
  text-decoration: none;

  &:hover {
    background: #fbf6df;
    color: #000;
  }
`;

export const SubItemWrap = styled.div`
  background: #fbf6df;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 20px;
  padding-bottom: 10px;
`;

export const SubItem = styled(NavLink)`

  display: flex;
  flex-shrink: 0;
  height: 25px;
  color: #656464;
  text-decoration: none;

  &:hover {
    color: #000;
    text-decoration: underline;
  }
`;

export const Link = styled.a`
  display: flex;
  flex-shrink: 0;
  height: 50px;
  width: 100%;
  align-items: center;
  padding-right: 20px;
  box-sizing: border-box;
  cursor: pointer;
  justify-content: flex-end;
  color: #656464;
  text-decoration: none;

  &:hover {
    color: #000;
  }
`;
