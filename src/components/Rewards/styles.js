import styled from 'styled-components';

export const Header = styled.div`
  height: 40px;
  display: flex;
  border-bottom: 1px solid #d1d1d1;
  align-items: center;
  flex-shrink: 0;
`;

export const DateSelect = styled.select`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 10px;
  text-align: center;
  cursor: pointer;
  background: #f7f7f7;
  appearance:none;
  font-size: 1.1em;
`;

export const SettledBar = styled.div`
  text-align: center;
  padding: 5px 15px;
  height: 25px;
  background: ${props => props.complete ? '#e7ffe3' : '#f3f3f3'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
`;