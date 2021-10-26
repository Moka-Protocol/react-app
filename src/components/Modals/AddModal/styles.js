import styled from 'styled-components';

export const InputWrap = styled.div`
  margin: 10px 0px;
`;

export const TextArea = styled.textarea`
  height: 150px;
  background: #f9f9f9;
  border: 1px solid #d1d1d1;
  padding: 20px;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  resize: none;
`;

export const SubmitButton = styled.button`
  width: 85px;
  background: #ffd700;
  border: none;
  height: 40px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 700;
`;

export const TXError = styled.div`
  margin-top: 15px;
  color: #e34848;
  font-weight: 500;
  font-size: 0.95em;
  text-align: center;
`;