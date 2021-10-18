import styled from 'styled-components';

export const Wrap = styled.div`
  width: 220px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  position: relative;
  flex-direction: column;
`;

export const Wallet = styled.div`
  display: flex;
  flex-direction: column;
  width: 175px;
  background: #ffd700;
  margin-left: 15px;
  margin-top: 15px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #ccaf17;
  padding: 15px 10px;
  box-sizing: border-box;
  flex-shrink: 0;
`;

export const WalletRow = styled.div`
  display: flex;
  margin: 3px 0px;
`;

export const WalletRowBalance = styled.div`
  margin-left: auto;
  margin-right: 5px;
  display: flex;
`;

export const WalletRowIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 3px;
`;

export const ClaimTokens = styled.div`
  background: #41b123;
  padding: 8px 6px;
  border-radius: 5px;
  margin-top: 15px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  line-height: 1.3;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

export const ClaimTokensIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Link = styled.a`
  display: flex;
  flex-shrink: 0;
  height: 45px;
  width: 100%;
  align-items: center;
  padding-left: 20px;
  box-sizing: border-box;
  cursor: pointer;
  color: #656464;
  text-decoration: none;

  &:hover {
    color: #000;
  }
`;
