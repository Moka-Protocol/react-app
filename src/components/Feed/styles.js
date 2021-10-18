import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const Wrap = styled.div`
  box-shadow: rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(0 0 0 / 20%) 0px 2px 1px -1px;
  width: 100%;
  min-width: 500px;
  display: flex;
  flex: 1;
  flex-direction: column;
  flex-shrink: 0;
  background: #fff;
  z-index: 2;
`;

export const Header = styled.div`
  height: 60px;
  display: flex;
  border-bottom: 1px solid #d1d1d1;
  align-items: center;
  flex-shrink: 0;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  padding-left: 15px;
  font-size: 0.9em;
  height: 100%;
`;

export const HeaderItem = styled(NavLink)`
  color: #6d6d6d;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  height: 100%;

  &:hover {
    color: #000;
    text-decoration: underline;
  }
`;

export const HeaderIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderMiddot = styled.div`
  color: #6d6d6d;
  margin: 0 5px;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export const Footer = styled.div`
  margin-top: auto;
  height: 50px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  display: flex;
  color: #333;
  font-size: 0.9em;
`;