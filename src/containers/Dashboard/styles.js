import styled from 'styled-components';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 1000px;
  margin: auto;
  min-height: 100%;
  background: #fff;
  box-shadow: rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(0 0 0 / 20%) 0px 2px 1px -1px;
  z-index: 100;

  @media (max-width: 1440px) {
    width: 800px;
  }

  @media (max-width: 1280px) {
    width: 500px;
  }

  @media (max-width: 1000px) {
    width: 100%;
  }
`;
