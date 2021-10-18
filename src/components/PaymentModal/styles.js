import styled from 'styled-components';

export const CoinButton = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  border: ${props => props.isSelected === true ? '1px solid #333' : '1px solid #ced0d9'};
  background: ${props => props.isSelected === true ? '#dbdada' : 'none'};
  border-radius: 10px;
  display: flex;
  width: 100px;
  height: 35px;
  margin: 5px;

  &:hover {
    border: 1px solid #333;
    background: #f1f1f1;
  }
`;

export const Title = styled.div`
  margin: 15px 0px;
  line-height: 1.5;
`;

export const CoinOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const CoinSVG = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
`;

export const CoinName = styled.div`
  font-size: 0.95em;
  font-weight: 600;
  display: flex;
  flex: 1;
  justify-content: center;
`;

export const SubmitButton = styled.div`
  background: #41b123;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0 10px 0px;
  border-radius: 5px;
  opacity: ${props => props.hasSelection === true ? '1' : '0.5'};
`;

export const SubmitIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;